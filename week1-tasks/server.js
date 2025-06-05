const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const mysql = require('mysql2');
require('dotenv').config();

app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
    } else {
        console.log('Connected to MySQL');
    }
});

let quotes = [];
try {
    const data = fs.readFileSync('quotes.json', 'utf8');
    quotes = JSON.parse(data);
} catch (err) {
    console.error('Failed to load quotes: ', err);
}

app.get('/api/random', (req, res) => {
    const query = `SELECT * FROM quotes ORDER BY RAND() LIMIT 1`;
    db.query(query, (err, results) => {
        if (err){
            console.error('Error fetching random quote: ', err);
            res.status(500).json({error: 'Database error'});
        } else {
            res.json(results[0]);
        }
    })
});

app.get('/api/quotes', (req,res) => {
    const query = `SELECT * FROM quotes `;
    db.query(query, (err, results) => {
        if (err){
            console.error('Error fetching all quotes: ', err);
            res.status(500).json({error: 'Database error'});
        } else {
            res.json(results);
        }
    })
});

app.get('/api/search', (req,res) => {
    const author = req.query.author;
    const query = `SELECT * FROM quotes WHERE author LIKE ?`;
    db.query(query, [`%${author}%`], (err,results) => {
        if (err) {
            console.log('Search error', err);
            res.status(500).json({error: 'Database error'});
        } else {
            res.json(results);
        }
    })
});

app.listen(PORT, () => {
    console.log(`Quote API is at http://localhost:${PORT}`);
});
