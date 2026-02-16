# Voting App - Docker Microservices

A full-stack voting application built with microservices architecture, running entirely with Docker Compose.

## 🏗️ Architecture

This application consists of 5 services:

1. **voting-app** (Python/Flask) - Frontend for casting votes
2. **result-app** (Node.js/Express) - Frontend for viewing results
3. **worker** (Node.js) - Background service that processes votes
4. **redis** - Message queue for storing votes temporarily
5. **db** (PostgreSQL) - Persistent storage for votes

### Data Flow

```
User Vote → Voting App → Redis Queue → Worker → PostgreSQL → Result App
```

## 📁 Project Structure

```
voting-app-microservices/
├── voting-app/
│   ├── app.py                 # Flask application
│   ├── templates/
│   │   └── index.html        # Voting UI
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile
├── result-app/
│   ├── server.js             # Express application
│   ├── public/
│   │   └── index.html        # Results UI
│   ├── package.json          # Node dependencies
│   └── Dockerfile
├── worker/
│   ├── worker.js             # Background processor
│   ├── package.json          # Node dependencies
│   └── Dockerfile
├── docker-compose.yml        # Orchestration file
└── README.md
```

## 🚀 Quick Start

### ⚡ TL;DR - Deploy Now

```bash
# Make sure Docker Desktop is running, then:
cd voting-app-microservices
docker compose up --build
```

**Access:**
- Voting: http://localhost:5000
- Results: http://localhost:5001

**Stop:**
- Press `Ctrl+C`, then run: `docker compose down`

---

### Prerequisites

- **Docker Desktop** (recommended) or Docker Engine (version 20.10 or higher)
- Docker Compose V2 (included with Docker Desktop)

#### Installing Docker Desktop

**Windows:**
1. Download from: https://www.docker.com/products/docker-desktop/
2. Run the installer
3. Enable WSL 2 if prompted
4. Restart your computer
5. Start Docker Desktop

**Verify Installation:**
```bash
docker --version
docker compose version
```

### Running the Application

1. **Clone or navigate to the project directory:**
   ```bash
   cd voting-app-microservices
   ```

2. **Build and start all services:**
   ```bash
   docker compose up --build
   ```
   
   *Note: Use `docker compose` (without hyphen) for Docker Desktop / Docker Compose V2*

3. **Access the applications:**
   - **Voting Page:** http://localhost:5000
   - **Results Page:** http://localhost:5001

4. **To stop the application:**
   ```bash
   docker compose down
   ```

5. **To stop and remove volumes (reset database):**
   ```bash
   docker compose down -v
   ```

## 🎯 How It Works

### Voting Flow

1. User opens http://localhost:5000
2. Clicks either "Cats" 🐱 or "Dogs" 🐶
3. Vote is sent to the Flask app
4. Flask app pushes vote to Redis queue
5. Worker picks up vote from Redis
6. Worker saves vote to PostgreSQL
7. Result app reads from PostgreSQL
8. Results update automatically every 2 seconds

### Service Details

#### Voting App (Port 5000)
- Built with Python Flask
- Provides a simple UI with two voting buttons
- Pushes votes to Redis queue
- Health check endpoint: `/health`

#### Result App (Port 5001)
- Built with Node.js/Express
- Displays real-time voting results
- Auto-refreshes every 2 seconds
- Shows percentage bars and vote counts
- Health check endpoint: `/health`

#### Worker (Background Service)
- Built with Node.js
- Continuously polls Redis for new votes
- Automatically creates database table on startup
- Saves votes to PostgreSQL
- Includes error handling and retry logic

#### Redis (Port 6379)
- Official Redis 7 Alpine image
- Acts as message queue
- Temporary storage for votes

#### PostgreSQL (Port 5432)
- Official PostgreSQL 15 Alpine image
- Persistent storage for all votes
- Database name: `votes`
- Table: `votes` (id, vote, created_at)

## 🔧 Configuration

### Environment Variables

All services use environment variables for configuration. Default values are set in `docker-compose.yml`:

**Database:**
- `POSTGRES_USER=postgres`
- `POSTGRES_PASSWORD=postgres`
- `POSTGRES_DB=votes`

**Redis:**
- `REDIS_HOST=redis`
- `REDIS_PORT=6379`

## 📊 Monitoring

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f voting-app
docker compose logs -f result-app
docker compose logs -f worker
docker compose logs -f redis
docker compose logs -f db
```

### Check Service Status

```bash
docker compose ps
```

### Health Checks

```bash
# Voting app health
curl http://localhost:5000/health

# Result app health
curl http://localhost:5001/health
```

## 🐛 Troubleshooting

### Services not starting

1. Check if ports are already in use:
   ```bash
   # Check if ports 5000, 5001, 5432, 6379 are available
   netstat -an | findstr "5000 5001 5432 6379"
   ```

2. Rebuild containers:
   ```bash
   docker compose down
   docker compose up --build --force-recreate
   ```

### Docker not found

If you get "docker is not recognized" error:
1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/
2. Restart your terminal after installation
3. Verify: `docker --version`

### Database connection issues

1. Wait for PostgreSQL to be ready (it takes a few seconds)
2. Check database logs:
   ```bash
   docker compose logs db
   ```

### Worker not processing votes

1. Check worker logs:
   ```bash
   docker compose logs worker
   ```

2. Verify Redis connection:
   ```bash
   docker compose exec redis redis-cli ping
   ```

## 🧪 Testing

1. Open voting page: http://localhost:5000
2. Cast several votes for cats and dogs
3. Open results page: http://localhost:5001
4. Verify votes are being counted correctly
5. Check logs to see the data flow:
   ```bash
   docker compose logs -f
   ```

## 🔒 Security Notes

**For Production Use:**
- Change default PostgreSQL password
- Add authentication to Redis
- Use secrets management
- Implement rate limiting
- Add HTTPS/TLS
- Set up proper logging and monitoring
- Use non-root users in containers

## 📝 Technical Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend APIs:** Python Flask, Node.js Express
- **Background Processing:** Node.js
- **Message Queue:** Redis
- **Database:** PostgreSQL
- **Container Orchestration:** Docker Compose

## 🌟 Features

✅ Microservices architecture  
✅ Containerized with Docker  
✅ Real-time result updates  
✅ Automatic database initialization  
✅ Health checks for all services  
✅ Comprehensive logging  
✅ Graceful shutdown handling  
✅ Persistent data storage  
✅ Beautiful, responsive UI  

## 📦 Building Individual Services

```bash
# Build voting app
docker build -t voting-app ./voting-app

# Build result app
docker build -t result-app ./result-app

# Build worker
docker build -t worker ./worker
```

## 🔄 Scaling Services

```bash
# Scale worker to 3 instances
docker compose up --scale worker=3 -d
```

## 📄 License

This project is open source and available for learning purposes.

## 👥 Contributing

Feel free to fork, modify, and use this project for learning Docker and microservices!

---

**Happy Voting! 🗳️**