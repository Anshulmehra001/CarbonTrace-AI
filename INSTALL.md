# Installation Guide

## Quick Setup

### 1. Install Backend
```bash
cd backend
pip install -r requirements.txt
python init_db.py
python -m uvicorn main:app --reload
```
Backend runs on: http://localhost:8000

### 2. Install Frontend (new terminal)
```bash
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

### 3. Login
```
Email: demo@carbontrace.ai
Password: demo123
```

## That's it!

- View dashboard with charts
- Add new carbon activities
- Generate ESG reports
- API docs at: http://localhost:8000/docs
