const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { exec } = require('child_process');

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/sozo/execute', (req, res) => {
    const {
        contract, selector, calldata
    } = req.query
    let sozoQuery = "sozo execute " + contract + " " + selector
    if (calldata) {
        sozoQuery += " --calldata " + calldata
    }
    exec(sozoQuery, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Stdout: ${stdout}`);
    });
});

// 404 Error Handler
app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

// General error handler
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

