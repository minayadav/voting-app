# Quick Start Guide

## ⚡ Get Started in 3 Steps

### Step 1: Navigate to Project
```bash
cd voting-app-microservices
```

### Step 2: Start the Application
```bash
docker-compose up --build
```

Wait for all services to start (about 30-60 seconds).

### Step 3: Open and Vote!
- **Vote:** http://localhost:5000
- **Results:** http://localhost:5001

## 🎬 What to Expect

When you run `docker-compose up --build`, you'll see:

1. ✅ Building 3 Docker images (voting-app, result-app, worker)
2. ✅ Pulling 2 images from Docker Hub (Redis, PostgreSQL)
3. ✅ Starting 5 containers
4. ✅ Health checks passing
5. ✅ Services ready to use

## 📋 Sample Output

```
✅ Container voting-redis      Started
✅ Container voting-db         Started
✅ Container voting-app        Started
✅ Container result-app        Started
✅ Container voting-worker     Started
```

## 🎯 Try It Out

1. Open http://localhost:5000
2. Click **Cats** 🐱 or **Dogs** 🐶
3. See confirmation message
4. Open http://localhost:5001
5. Watch results update in real-time!

## 🛑 Stop the Application

Press `Ctrl+C` in the terminal, then:

```bash
docker-compose down
```

To remove all data and start fresh:
```bash
docker-compose down -v
```

## ✅ Verify Everything Works

### Check Services Status
```bash
docker-compose ps
```

All services should show "Up" status.

### Check Logs
```bash
docker-compose logs -f
```

You should see:
- ✅ Voting app: "Starting Voting App..."
- ✅ Result app: "Result app listening on port 5001"
- ✅ Worker: "Worker started. Waiting for votes..."

### Test Health Endpoints
```bash
curl http://localhost:5000/health
curl http://localhost:5001/health
```

Both should return `{"status": "healthy"}`.

## 🐛 Common Issues

### Port Already in Use
If you see "port is already allocated":
- Stop any service using ports 5000, 5001, 5432, or 6379
- Or change ports in `docker-compose.yml`

### Services Not Starting
If containers exit immediately:
```bash
docker-compose down
docker-compose up --build --force-recreate
```

### Can't Connect to Services
Wait 30 seconds for all services to be ready, especially PostgreSQL.

## 💡 Tips

- Keep terminal open to see real-time logs
- Use another terminal to check status: `docker-compose ps`
- View specific service logs: `docker-compose logs voting-app`
- Refresh results page to see live updates

## 🎉 You're All Set!

Enjoy exploring the microservices architecture!

For detailed documentation, see [README.md](README.md)