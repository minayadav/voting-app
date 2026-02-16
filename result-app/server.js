const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 5001;

// Configure logging
const log = (level, message) => {
    console.log(`${new Date().toISOString()} - ${level} - ${message}`);
};

// PostgreSQL connection
const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'db',
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'votes'
});

// Test database connection
pool.on('connect', () => {
    log('INFO', 'Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    log('ERROR', `PostgreSQL error: ${err.message}`);
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Get voting results
app.get('/results', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT vote, COUNT(*) as count FROM votes GROUP BY vote ORDER BY vote'
        );
        
        const votes = {
            cats: 0,
            dogs: 0
        };
        
        result.rows.forEach(row => {
            votes[row.vote] = parseInt(row.count);
        });
        
        log('INFO', `Results fetched: Cats=${votes.cats}, Dogs=${votes.dogs}`);
        res.json(votes);
    } catch (err) {
        log('ERROR', `Error fetching results: ${err.message}`);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Health check
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'healthy', database: 'connected' });
    } catch (err) {
        res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
    }
});

// Serve index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    log('INFO', `Result app listening on port ${port}`);
});