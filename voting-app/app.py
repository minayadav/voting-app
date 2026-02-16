import os
import logging
from flask import Flask, render_template, request, jsonify
import redis
import json

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Redis connection
redis_host = os.environ.get('REDIS_HOST', 'redis')
redis_port = int(os.environ.get('REDIS_PORT', 6379))

def get_redis_connection():
    try:
        r = redis.Redis(host=redis_host, port=redis_port, db=0, decode_responses=True)
        r.ping()
        logger.info(f"Successfully connected to Redis at {redis_host}:{redis_port}")
        return r
    except Exception as e:
        logger.error(f"Failed to connect to Redis: {e}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/vote', methods=['POST'])
def vote():
    try:
        data = request.get_json()
        vote_option = data.get('vote')
        
        if vote_option not in ['cats', 'dogs']:
            logger.warning(f"Invalid vote option received: {vote_option}")
            return jsonify({'error': 'Invalid vote option'}), 400
        
        r = get_redis_connection()
        if r is None:
            return jsonify({'error': 'Could not connect to Redis'}), 500
        
        # Push vote to Redis queue
        vote_data = json.dumps({'vote': vote_option})
        r.rpush('votes', vote_data)
        
        logger.info(f"Vote recorded: {vote_option}")
        return jsonify({'success': True, 'vote': vote_option})
    
    except Exception as e:
        logger.error(f"Error processing vote: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/health')
def health():
    r = get_redis_connection()
    if r is None:
        return jsonify({'status': 'unhealthy', 'redis': 'disconnected'}), 503
    return jsonify({'status': 'healthy', 'redis': 'connected'})

if __name__ == '__main__':
    logger.info("Starting Voting App...")
    app.run(host='0.0.0.0', port=5000, debug=True)