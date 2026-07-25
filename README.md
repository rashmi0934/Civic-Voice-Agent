# Civic Voice Agent

An AI-powered civic complaint management system that allows citizens to submit complaints through text or voice. The system processes complaints using AI agents and presents structured, actionable information to local leaders through a dashboard.

## Features

- Submit complaints through text or voice
- Voice-to-text transcription using Faster-Whisper
- Complaint validation
- Complaint categorization
- Urgency assessment
- Extraction of location and actionable details
- Duplicate complaint detection
- Complaint summary generation
- Leader dashboard for viewing and managing complaints
- Complaint status tracking

## AI Pipeline

```text
Citizen Input
     ↓
Text / Voice
     ↓
Speech-to-Text (for voice)
     ↓
Validation Agent
     ↓
Duplicate Detection
     ↓
Complaint Analysis
     ↓
Database
     ↓
Leader Dashboard

```
## Tech Stack

Backend
- Python
- FastAPI
- SQLAlchemy
- MySQL
- PyMySQL

Frontend
- React
- Vite
- JavaScript
- CSS

AI
- Ollama
- Qwen3:4B
- Faster-Whisper

## Setup
1. Clone the Repository
```
git clone <YOUR_REPOSITORY_URL>
cd Civic-Voice-Agent
```
3. Create and Activate a Virtual Environment
```
python -m venv venv
.\venv\Scripts\activate
```

4. Install Backend Dependencies
```
cd backend
pip install -r requirements.txt
```

5. Configure the Database

Create a MySQL database: ``` CREATE DATABASE civic_voice; ```

Create a .env file inside the backend folder:
```
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=civic_voice
```

6. Install the Qwen model:
```
ollama pull qwen3:4b
```

7. Start the Backend

From the backend folder: ``` uvicorn app.main:app --reload ```

Backend: ```http://127.0.0.1:8000 ```

API Documentation: ``` http://127.0.0.1:8000/docs ```

8. Start the Frontend

Open another terminal:
```
cd frontend
npm install
npm run dev
```

Frontend:``` http://localhost:5173```

## Project Structure
```
Civic-Voice-Agent/
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   ├── core/
│   │   ├── managers/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   │
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── pages/
│       ├── services/
│       └── App.jsx
│
└── README.md
```

## Future Improvements
- Improve multilingual text processing
- Improve duplicate detection using multilingual embeddings
- Add confidence scores and human review
- Move long-running AI operations to background workers
- Add authentication and role-based access control
- Add rate limiting and observability
- Deploy the system to production

## Author
Rashmi
