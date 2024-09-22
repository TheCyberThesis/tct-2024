const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const port = 5000;

app.disable('etag');

app.use(session({
    secret: '7w6crn237r7efw78gf84rgewgf0wegf2378rfpiesnke8r8wephcdweouw0jcejfw0fjvwe9fwefwefheowhofhwbvo',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true in production with HTTPS
}));

const correctPin = '9297';

let attempts = {};

const pinAttemptLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limiting each session_id to 5 PIN attempts per windowMs
    keyGenerator: (req) => {
        const place = req.query.place;
        // Only count if place=heart, otherwise use a unique key that won't count
        return place === 'heart' ? `${req.cookies['session_id'] || req.ip}-heart` : `${req.cookies['session_id'] || req.ip}-no-limit`;
    },
    skip: (req) => {
        const place = req.query.place;
        return place !== 'heart'; 
    },
    handler: (req, res) => {
        res.render('pin', { error: 'Too many failed attempts. Please try again later.' });
    },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to set a default session_id cookie if it doesn't exist
app.use((req, res, next) => {
    if (!req.cookies['session_id']) {
        res.cookie('session_id', Math.random().toString(36).substring(2, 15), { httpOnly: true });
    }
    next();
});

// Middleware to track attempts and introduce a delay
function bruteForceProtection(req, res, next) {
    const sessionId = req.cookies['session_id'] || req.ip;
    const place = req.query.place;

    if (!attempts[sessionId]) {
        attempts[sessionId] = { count: 0, lastAttempt: Date.now() };
    }

    const timeSinceLastAttempt = Date.now() - attempts[sessionId].lastAttempt;

    // Reset attempts after 15 minutes of inactivity
    if (timeSinceLastAttempt > 15 * 60 * 1000) {
        attempts[sessionId].count = 0;
    }

    attempts[sessionId].lastAttempt = Date.now();

    const delay = Math.min(attempts[sessionId].count * 500, 5000); // Max delay of 5 seconds

    if (req.method === 'POST' && place === 'heart') {
        attempts[sessionId].count += 1;
    }

    // If the session_id is manipulated, reset the delay
    if (req.cookies['session_id'] !== sessionId) {
        attempts[sessionId].count = 0; 
    }

    setTimeout(next, delay);
}

app.get('/', (req, res) => {
    res.redirect('/blind');
});

app.post('/', (req, res) => {
    res.redirect('/blind');
});

// Route for GET and POST /blind
app.get('/blind', bruteForceProtection, (req, res) => {
    const place = req.query.place;
    if (place === 'heart') {
        res.render('bait');
    } else {
        res.render('blank');
    }
});
app.get('/54xbvvn45gv4v3kv4gv3k4v3kv3k', (req, res) => {
    res.render('catch');
})
app.post('/blind', pinAttemptLimiter, bruteForceProtection, (req, res) => {
    const { pin1, pin2, pin3, pin4 } = req.body;
    const pin = pin1 + pin2 + pin3 + pin4;
    const place = req.query.place;

    if (place !== 'heart') {
        res.render('bait');
        return;
    }

    if (!pin1 || !pin2 || !pin3 || !pin4) {
        res.render('pin', { error: null });
        return;
    }

    if (pin === correctPin) {
        req.session.correctPinEntered = true; // Set session variable
        res.redirect('/final-challenge');
    } else {
        res.render('pin', { error: 'Incorrect PIN. Please try again.' });
    }
});

// Middleware to protect the final challenge route
function requireCorrectPin(req, res, next) {
    if (!req.session.correctPinEntered) {
        return res.redirect('/blind'); 
    }
    next();
}

// Final Challenge Route (protected by session check)
app.get('/final-challenge', requireCorrectPin, (req, res) => {
    res.render('final-challenge');
});

// Simulated network requests to reveal parts of a hidden message
const messageParts = ['T', 'C', 'T', '{', '7', 'h', '3', '_', 'B', '4', 'i', '7', '_', 'w', '4', 's', '_', 'U', 's', '3', 'f', 'u', 'l', '}'];

messageParts.forEach((part, index) => {
    app.get(`/final-challenge_${index}`, requireCorrectPin, (req, res) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // No caching
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.send(`${part}`);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`CTF listening at http://localhost:${port}`);
});
