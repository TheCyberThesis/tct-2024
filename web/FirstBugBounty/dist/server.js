const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const sanitizeHtml = require('sanitize-html');

const app = express();
const PORT = process.env.PORT || 5000;
const saltRounds = 10;


const uri = "**************************************************************************************";
const client = new MongoClient(uri);


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: '*******************************',
        pass: '*******************************'
    }
});


const jwtSecretKey = '**************************************************************';


const csrfProtection = csrf({ cookie: true });


const sessionMiddleware = session({
    key: '*******************************',
    secret: '**************************************************************',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, 
        secure: process.env.NODE_ENV === '**************',
        httpOnly: true,
        sameSite: 'strict'
    }
});

app.use(sessionMiddleware);
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

let usersCollection;

async function connectToDatabase() {
    try {
        await client.connect();
        const database = client.db('****************'); 
        usersCollection = database.collection('***************'); 
    } catch (err) {
        console.error(`Failed to connect to MongoDB: ${err}`);
    }
}

connectToDatabase();

// Rate Limiter
const createAccountLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    handler: (req, res) => {
        res.status(429).render('register', {
            rateLimitMessage: 'Please try again later. You have exceeded the maximum number of attempts.'
        });
    }
});

const loginAccountLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    handler: (req, res) => {
        res.status(429).render('login', {
            rateLimitMessage: 'Please try again later. You have exceeded the maximum number of attempts.'
        });
    }
});

app.use('/register', createAccountLimiter);
app.use('/login', loginAccountLimiter);

app.get('/register', csrfProtection, (req, res) => {
    res.render('register', { csrfToken: req.csrfToken(), error: null, formData: {} });
});

app.get('/dashboard', csrfProtection, async (req, res) => {
    const { username } = req.session;
    
    if (!username) {
        return res.redirect('/login');
    }

    const user = await usersCollection.findOne({ username });
    
    if (!user) {
        return res.redirect('/login'); 
    }

    if (user.isVerified) {
        if (user.isAdmin) {
            return res.redirect('/flag');
        } else {
            res.render('dashboard', { csrfToken: req.csrfToken(), error: null, formData: {} });
        }
    } else {
        return res.redirect('/verify');
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).render('500', { title: '500: Internal Server Error', message: 'Something went wrong!' });
        }
        res.redirect('/login');
    });
});

app.get('/login', async (req, res) => {
        res.render('login');
});

app.get('/verify', async (req, res) => {
    const { username } = req.session;
    if (!username) {
        return res.redirect('/login');
    }

    try {
        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.render('verify', { error: 'User not found' });
        }
        if (user.isVerified) {
            if (user.isAdmin) {
                req.session.username = username;
                return res.redirect('/flag');
            } else {
                req.session.username = username;
                return res.redirect('/dashboard');
            }
        }
        res.render('verify');
    } catch (error) {
        res.status(500).render('verify', { error: 'Internal server error' });
    }
});

app.get('/recover', (req, res) => {
    res.render('recover');
});


app.post('/register', express.json({ limit: '10kb' }), csrfProtection, async (req, res) => {
    let { username, password, email } = req.body;
    username = sanitizeHtml(username);
    email = sanitizeHtml(email);

    if (!username || !password || !email) {
        return res.render('register', { error: 'All fields are required', formData: { username, password, email }, csrfToken: req.csrfToken() });
    }

    try {
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.render('register', { error: 'Username already exists', formData: { username, password, email }, csrfToken: req.csrfToken() });
        }

        const existingEmail = await usersCollection.findOne({ email });
        if (existingEmail) {
            return res.render('register', { error: 'Email already exists', formData: { username, password, email }, csrfToken: req.csrfToken() });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = { username, email, password: hashedPassword, isVerified: false, isAdmin: false };
        await usersCollection.insertOne(newUser);

        const verificationToken = jwt.sign({ username, email }, jwtSecretKey, { expiresIn: '12h' });
        const url = `${req.protocol}://${req.get('host')}/verifyemail?token=${verificationToken}`;
        const mailOptions = {
            from: 'mbbcok@gmail.com',
            to: email,
            subject: 'Verify Your Email',
            html: `
                <html>
                    <body>
                        <h1>Verify Your Email</h1>
                        <p>Click the link below to verify your email address:</p>
                        <a href="${url}">Verify Email</a>
                    </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);

        res.render('register', { success: 'User registered successfully\n', formData: {}, csrfToken: req.csrfToken() });
    } catch (error) {
        res.status(500).render('register', { error: error.message, formData: { username, password, email }, csrfToken: req.csrfToken() });
    }
});

// Middleware to protect the /flag route
function ensureAdmin(req, res, next) {
    if (!req.session.username) {
        return res.redirect('/login');
    }

    usersCollection.findOne({ username: req.session.username })
        .then(user => {
            if (user && user.isAdmin) {
                next();
            } else {
                res.redirect('/dashboard');
            }
        })
        .catch(error => {
            res.status(500).render('500', { message: 'Internal server error' });
        });
}

app.post('/login', async (req, res) => {
    let { username, password } = req.body;
    username = sanitizeHtml(username);
    

    try {
        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.render('login', { error: 'Invalid username or password' });
        }
        req.session.username = username;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.render('login', { error: 'Invalid username or password' });
        }

        req.session.username = username;

        if (user.isVerified) {
            if (user.isAdmin) {
                req.session.username = username;
                return res.redirect('/flag');
            } else {
                req.session.username = username;
                return res.redirect('/dashboard');
            }
        } else {
            req.session.username = username;
            return res.redirect('/verify');
        }

    } catch (error) {
        res.status(500).render('login', { error: error.message, formData: { username } });
    }
});

app.get('/verifyemail', async (req, res) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, jwtSecretKey);
        const { username } = decoded;

        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.render('verifyemail', { preverifymsg: 'User not found' });
        }

        if (user.isVerified) {
            return res.render('verifyemail', { preverifymsg: '<h3>Email already Verified!</h3>Your email address has already been verified. There is no need to take any further action. Feel free to explore the features available to you. Click <a href="/login">here</a> to login now.' });
        }

        await usersCollection.updateOne({ username }, { $set: { isVerified: true } });

        res.render('verifyemail', { successverifymsg: '<h3>Email Successfully Verified!</h3> Your email has been successfully verified. Your account is now fully activated, and you can begin using all the features of our platform. Click <a href="/login">here</a> to login now.' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.render('verifyemail', {
                expiredverifymsg: '<h3>Expired Verification Link!</h3>The verification link has expired. To complete your email verification, please click <a href="' + req.protocol + '://' + req.get('host') + '/resend-verification">here</a> to request a new verification link.',
                token: req.query.token
            });
        } else {
            res.status(500).render('verifyemail', {
                brokenverifymsg: '<h3>Invalid Link Detected!</h3>The link you have attempted to use is invalid. It may have been mistyped. Please check your email for the correct link or request a new one. If you continue to experience issues, contact our support team for assistance. Click <a href="/login">here</a> to login now.'
            });
        }
    }
});

app.post('/resend-verification', async (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jwt.decode(token);
        const { username, email } = decoded;

        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.render('verifyemail', { brokenverifymsg: 'No action needed!' });
        }

        if (user.isVerified) {
            return res.render('verifyemail', { preverifymsg: 'Email already Verified!' });
        }

        const newToken = jwt.sign({ username, email }, jwtSecretKey, { expiresIn: '12h' });
        const url = `${req.protocol}://${req.get('host')}/verifyemail?token=${newToken}`;
        const mailOptions = {
            from: 'mbbcok@gmail.com',
            to: email,
            subject: 'Verify Your Email',
            text: `Please click on the following link to verify your email: ${url}`
        };

        await transporter.sendMail(mailOptions);
        return res.render('verifyemail', { successverifymsg: 'Verification Mail Resent!' });
    } catch (error) {
        return res.render('verifyemail', { brokenverifymsg: 'Error: Resending Verification' });
    }
});

app.post('/recover', async (req, res) => {
    const { email, credential } = req.body;
    const reset_jwt_key = '**************************************************************';

    try {
        if (credential !== 'username' && credential !== 'password') {
            return res.render('recover', { message: 'Invalid credential type' });
        }

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.render('recover', { message: 'No account with that email address exists.' });
        }

        const token = jwt.sign({ username: user.username, email, action: credential }, reset_jwt_key, { expiresIn: '1h' });
        const url = `${req.protocol}://${req.get('host')}/reset?token=${token}`;
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: `Recover your ${credential}`,
            html: `
                <html>
                    <head>
                        <style>
                            body { 
                                background-color: #f7f7f7; 
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                                padding: 0;
                                margin: 0;
                            }
                            .email-container {
                                max-width: 600px; 
                                margin: 20px auto; 
                                background: white; 
                                padding: 20px; 
                                border-radius: 10px; 
                                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                            }
                            .header {
                                background: #13121D; 
                                color: white; 
                                padding: 10px 20px; 
                                border-top-left-radius: 10px; 
                                border-top-right-radius: 10px;
                                text-align: center;
                            }
                            .content {
                                padding: 20px; 
                                line-height: 1.5; 
                                color: #444;
                            }

                            .content p{
                                color: #454545;
                            }

                            a.button {
                                display: block;
                                width: max-content;
                                background-color: #a50ca5;
                                color: white;
                                padding: 10px 20px;
                                text-align: center;
                                border-radius: 5px;
                                text-decoration: none;
                                margin: 20px auto 0;
                                transition: background-color 0.3s ease;
                            }
                            a.button:hover {
                                background-color: #930ca5;
                            }
                            .footer {
                                text-align: center;
                                font-size: 12px;
                                color: #777;
                                padding: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="header">
                                <h1>Account Recovery Assistance</h1>
                            </div>
                            <div class="content">
                                <p>Hello,</p>
                                <p>You recently requested to ${credential === 'username' ? 'retrieve your username' : 'reset your password'}. Please click the button below to proceed with your request. This link will expire in 1 hour for security reasons.</p>
                                <br><br>
                                <a href="${url}" class="button">${credential === 'username' ? 'Retrieve Username' : 'Reset Password'}</a>
                                <br><br><br><p>If you did not request this, please ignore this email or contact our support team immediately to ensure your account is secure.</p>
                            </div>
                            <div class="footer">
                                <p>Thank you for using Our Service!</p>
                                <p>If you need help, please contact support@example.com.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        res.render('recover', { successmessage: `A link to ${credential === 'username' ? 'retrieve your username' : 'reset your password'} has been sent to your email.` });
    } catch (error) {
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/reset', (req, res) => {
    const { token } = req.query;
    const reset_jwt_key = '**************************************************************';

    try {
        const decoded = jwt.verify(token, reset_jwt_key);
        if (decoded.action === 'username') {
            return res.render('reset', { option: 'username', username: decoded.username });
        } else if (decoded.action === 'password') {
            return res.render('reset', { option: 'password', token });
        } else {
            return res.status(400).render('reset', { errormsg: 'Invalid Request' });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.render('reset', { expiredverifymsg: 'Expired Reset Link' });
        } else {
            res.status(500).render('reset', { errormsg: 'Invalid Request' });
        }
    }
});

app.post('/updatePassword', async (req, res) => {
    const { password, newpassword } = req.body;
    const { token } = req.query;
    const reset_jwt_key = '**************************************************************';

    try {
        const decoded = jwt.verify(token, reset_jwt_key);
        if (decoded.action !== 'password') {
            return res.status(400).render('reset', { error: 'Invalid request', option: 'password', token });
        }

        if (!password || !newpassword) {
            return res.status(400).render('reset', { error: 'All fields are required', option: 'password', token });
        }

        if (password.length < 8 || newpassword.length < 8) {
            return res.status(400).render('reset', { error: 'Password must be at least 8 characters long', option: 'password', token });
        }

        if (password !== newpassword) {
            return res.status(400).render('reset', { error: 'Passwords do not match', option: 'password', token });
        }

        const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
        await usersCollection.updateOne({ username: decoded.username }, { $set: { password: hashedPassword } });

        res.render('login', { success: 'Password successfully updated. Please login with your new password.' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(400).render('reset', { error: 'Your reset link has expired. Please request a new one.', option: 'password', token });
        } else {
            res.status(500).render('reset', { error: 'Failed to update password. Please try again later.', option: 'password', token });
        }
    }
});


app.get('/flag', ensureAdmin, (req, res) => {
    res.render('flag');
});

app.use((err, req, res, next) => {
    res.status(500).render('500', {
        title: '500: Internal Server Error',
        message: 'Something went wrong!'
    });
});

app.use((req, res, next) => {
    res.status(404).render('404', {
        title: '404: File Not Found',
        message: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:5000/register`);
});
