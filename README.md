# Civic Voice Agent

An AI-powered civic complaint management system that enables citizens to submit civic complaints through text or voice. The system uses multiple AI agents to validate, analyze, and process complaints before securely storing them and presenting structured insights to authorized local leaders through a dashboard.

---

## Features

### Citizen Features
- User registration and login using JWT Authentication
- Submit complaints through text or voice
- Voice-to-text transcription using Faster-Whisper
- AI-powered complaint validation
- Automatic complaint categorization
- Urgency assessment
- Extraction of structured information:
  - Category
  - Location
  - Affected People
  - Requested Action
  - Summary
- Duplicate complaint detection
- Real-time feedback for invalid or incomplete complaints

### Leader Features
- Secure login for authorized users
- Dashboard with complaint analytics
- View all complaints
- Filter complaints by:
  - Category
  - Urgency
  - Status
- Update complaint status
- Complaint summary visualization

---

# AI Pipeline

```text
Citizen Input
       │
       ▼
Text / Voice
       │
       ▼
Speech-to-Text (Faster-Whisper)
       │
       ▼
Validation Agent
       │
       ▼
Processing Agent
       │
       ▼
Required Field Validation
       │
       ▼
Duplicate Detection Agent
       │
       ▼
Database (MySQL)
       │
       ▼
Leader Dashboard
```

---

# AI Agents

### Validation Agent
Determines whether the submitted text is a valid civic complaint or suggestion.

Rejects:
- Greetings
- Spam
- Abuse
- Irrelevant text
- Vague complaints

---

### Processing Agent

Extracts structured information including:

- Category
- Urgency
- Location
- Affected People
- Requested Action
- Summary
- Keywords
- Sentiment

The agent does **not hallucinate missing information** and leaves unavailable fields empty.

---

### Duplicate Detection Agent

Compares the incoming complaint with previously submitted complaints using an LLM to determine semantic similarity.

Returns:

- Duplicate or Not
- Confidence Score
- Duplicate Complaint ID (if applicable)
- Reason

---

# Authentication & Authorization

The project uses JWT-based authentication.

Features:

- User Registration
- Secure Login
- Password Hashing
- JWT Access Tokens
- Protected Complaint APIs
- Protected Dashboard APIs
- Role-based authorization ready for extension

---

# Tech Stack

## Backend

- Python
- FastAPI
- SQLAlchemy
- MySQL
- PyMySQL
- JWT Authentication
- Passlib (Password Hashing)

---

## Frontend

- React
- Vite
- JavaScript
- Axios
- CSS

---

## AI

- OpenRouter API
- DeepSeek Chat V3
- Faster-Whisper

---

# Project Structure

```text
Civic-Voice-Agent/
│
├── backend/
│   ├── app/
│   │
│   ├── agents/
│   │   ├── validation_agent.py
│   │   ├── processing_agent.py
│   │   ├── duplicate_agent.py
│   │   └── base_agent.py
│   │
│   ├── managers/
│   │   └── agent_manager.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── complaint.py
│   │   └── dashboard.py
│   │
│   ├── models/
│   ├── schemas/
│   ├── services/
│   │   ├── llm_service.py
│   │   └── whisper_service.py
│   │
│   ├── core/
│   ├── utils/
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.jsx
│
└── README.md
```

---

# Setup

## 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Civic-Voice-Agent
```

---

## 2. Create Virtual Environment

```bash
python -m venv venv
```

Windows

```bash
.\venv\Scripts\activate
```

Linux / macOS

```bash
source venv/bin/activate
```

---

## 3. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create a `.env` file inside the **backend** folder.

```env
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=civic_voice

OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=deepseek/deepseek-chat-v3-0324

```

---

## 5. Create Database

```sql
CREATE DATABASE civic_voice;
```

---

## 6. Start Backend

```bash
cd backend

uvicorn app.main:app --reload
```

Backend

```
http://127.0.0.1:8000
```

Swagger API

```
http://127.0.0.1:8000/docs
```

---

## 7. Start Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend

```
http://localhost:5173
```

---

# API Endpoints

## Authentication

- POST `/auth/register`
- POST `/auth/login`

---

## Complaints

- POST `/complaints/`
- GET `/complaints/`
- GET `/complaints/{id}`
- PATCH `/complaints/{id}/status`
- POST `/complaints/voice`

---

## Dashboard

- GET `/dashboard/summary`

---

# Validation Rules

The system automatically rejects:

- Greetings
- Spam
- Abuse without civic issue
- Irrelevant content
- Duplicate complaints
- Complaints with missing mandatory information (e.g., location)

---

# Security

- JWT Authentication
- Password Hashing
- Protected APIs
- Authorization Middleware

---

# Future Improvements

- Multilingual complaint processing
- Embedding-based duplicate detection
- Human review workflow
- Background task queue
- Email/SMS notifications
- Admin analytics dashboard
- Docker support
- Cloud deployment (AWS / Azure / Render)
- CI/CD pipeline

---

# Author

**Rashmi**

B.Tech Mathematics & Computing, IIT Delhi
