const redis = require('redis');
const { Pool } = require('pg');

// Configure logging
const log = (level, message) => {
    console.log(`${new Date().toISOString()} - ${level} - ${message}`);
};

// Redis client
const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || 'redis',
        port: process.env.REDIS_PORT || 6379
    }
});

// PostgreSQL connection
const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'db',
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'votes'
});

// Initialize database
async function initializeDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS votes (
                id SERIAL PRIMARY KEY,
                vote VARCHAR(10) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        log('INFO', 'Database table initialized successfully');
    } catch (err) {
        log('ERROR', `Failed to initialize database: ${err.message}`);
        throw err;
    }
}

// Process votes from Redis queue
async function processVotes() {
    try {
        // Connect to Redis
        await redisClient.connect();
        log('INFO', 'Connected to Redis');
        
        // Initialize database
        await initializeDatabase();
        
        log('INFO', 'Worker started. Waiting for votes...');
        
        // Continuously poll Redis for votes
        while (true) {
            try {
                // Block and wait for vote from Redis list
                const voteData = await redisClient.blPop('votes', 0);
                
                if (voteData) {
                    const vote = JSON.parse(voteData.element);
                    log('INFO', `Processing vote: ${vote.vote}`);
                    
                    // Insert vote into PostgreSQL
                    await pool.query(
                        'INSERT INTO votes (vote) VALUES ($1)',
                        [vote.vote]
                    );
                    
                    log('INFO', `Vote for ${vote.vote} saved to database`);
                }
            } catch (err) {
                log('ERROR', `Error processing vote: ${err.message}`);
                // Continue processing even if one vote fails
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    } catch (err) {
        log('ERROR', `Worker error: ${err.message}`);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    log('INFO', 'SIGTERM received, shutting down gracefully...');
    await redisClient.quit();
    await pool.end();
    process.exit(0);
});

process.on('SIGINT', async () => {
    log('INFO', 'SIGINT received, shutting down gracefully...');
    await redisClient.quit();
    await pool.end();
    process.exit(0);
});

// Start the worker
log('INFO', 'Starting worker service...');
processVotes().catch(err => {
    log('ERROR', `Fatal error: ${err.message}`);
    process.exit(1);
});