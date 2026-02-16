# Architecture Documentation

## System Overview

This is a microservices-based voting application demonstrating modern containerized application architecture using Docker.

## Service Communication

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│ Voting App  │   │ Result App  │
│   :5000     │   │   :5001     │
└──────┬──────┘   └──────┬──────┘
       │                 │
       ▼                 │
┌─────────────┐          │
│    Redis    │          │
│   :6379     │          │
└──────┬──────┘          │
       │                 │
       ▼                 │
┌─────────────┐          │
│   Worker    │          │
│  (bg proc)  │          │
└──────┬──────┘          │
       │                 │
       ▼                 ▼
┌──────────────────────────┐
│      PostgreSQL          │
│        :5432             │
└──────────────────────────┘
```

## Components

### 1. Voting App (Frontend)
**Technology:** Python 3.11 + Flask  
**Port:** 5000  
**Purpose:** User interface for casting votes

**Key Features:**
- RESTful API endpoint for vote submission
- Attractive, responsive UI
- Connects to Redis for vote queuing
- Health check endpoint

**API Endpoints:**
- `GET /` - Voting page
- `POST /vote` - Submit vote (JSON: `{vote: 'cats'|'dogs'}`)
- `GET /health` - Service health status

### 2. Result App (Frontend)
**Technology:** Node.js 18 + Express  
**Port:** 5001  
**Purpose:** Display real-time voting results

**Key Features:**
- Real-time result display
- Auto-refresh every 2 seconds
- Percentage-based progress bars
- Direct PostgreSQL connection

**API Endpoints:**
- `GET /` - Results page
- `GET /results` - JSON results data
- `GET /health` - Service health status

### 3. Worker (Background Service)
**Technology:** Node.js 18  
**Port:** None (background service)  
**Purpose:** Process votes from queue to database

**Key Features:**
- Continuous Redis queue polling
- Automatic database table creation
- Error handling and retry logic
- Graceful shutdown handling

**Responsibilities:**
- Listen to Redis `votes` list
- Parse vote data
- Insert votes into PostgreSQL
- Log all operations

### 4. Redis (Message Queue)
**Technology:** Redis 7 Alpine  
**Port:** 6379  
**Purpose:** Temporary storage and message queue

**Usage:**
- List key: `votes`
- Operation: RPUSH (voting-app) / BLPOP (worker)
- Ensures decoupling between frontend and backend

### 5. PostgreSQL (Database)
**Technology:** PostgreSQL 15 Alpine  
**Port:** 5432  
**Purpose:** Persistent vote storage

**Schema:**
```sql
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    vote VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Data Flow Sequence

1. **User casts vote:**
   - User clicks "Cats" or "Dogs" button
   - JavaScript sends POST to `/vote`
   - Flask receives request