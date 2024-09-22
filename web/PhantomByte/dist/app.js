const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));


const FLAG = 'TCT{Dummy_Flag_For_Testing}';

app.get('/', (req, res) => {
    res.send(renderForm());
});

app.post('/submit', (req, res) => {
    const userInput = req.body.input;
    let error = '';

    
    if (userInput.length !== 5 && !userInput.includes('\0')) {
        error = 'Input must be exactly 5 characters.';
        return res.send(renderForm(error));
    }


    const cleanInput = userInput.replace(/\0/g, '');
    const obfuscatedValue = ((parseInt(cleanInput) * 7) % 100000).toString();


    if (cleanInput !== 'cyberthesis' && obfuscatedValue !== '00000') {
        error = 'Error: Input does not match.';
        return res.send(renderForm(error));
    }


    return res.send(`Success! Here is your flag: ${FLAG}`);
});


function renderForm(error = '') {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CTF Challenge</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f0f8ff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .container {
                    background-color: #fff;
                    padding: 2rem;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                }
                h1 {
                    font-size: 1.8rem;
                    margin-bottom: 1rem;
                    color: #333;
                }
                input[type="text"] {
                    width: 100%;
                    padding: 0.75rem;
                    margin-bottom: 1rem;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 1rem;
                }
                button {
                    background-color: #34eb5e;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 5px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                button:hover {
                    background-color: #0056b3;
                }
                p {
                    color: #666;
                    margin-top: 1rem;
                    font-size: 0.9rem;
                }
                .error {
                    color: red;
                    margin-bottom: 1rem;
                    font-size: 1rem;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Enter the Secret Code</h1>
                ${error ? `<div class="error">${error}</div>` : ''}
                <form action="/submit" method="POST">
                    <input type="text" name="input" placeholder="Enter 5 digits" required>
                    <button type="submit">Submit</button>
                </form>
                <p>Can you solve the challenge?</p>
            </div>
        </body>
        </html>
    `;
}


app.listen(3001, () => {
    console.log('Challenge is running on http://localhost:3001');
});
