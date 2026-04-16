# Getting Started with CarbonTrace AI

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

## Installation

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Start server
uvicorn main:app --reload
```

Backend will be available at: http://localhost:8000

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend will be available at: http://localhost:3000

## Demo Credentials

```
Email: demo@carbontrace.ai
Password: demo123
```

## API Documentation

Interactive API documentation is available at: http://localhost:8000/docs

## Project Structure

```
carbontrace-ai/
├── backend/              # Python FastAPI backend
│   ├── main.py          # API routes
│   ├── models.py        # Database models
│   ├── ml_model.py      # ML prediction engine
│   └── ...
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   └── App.js
│   └── ...
└── docs/                # Documentation
```

## Key Features

- User authentication (JWT)
- Activity tracking (transport, energy, materials, waste)
- AI-powered emission predictions
- Interactive dashboard with charts
- ESG report generation
- REST API with comprehensive documentation

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
uvicorn main:app --reload --port 8001
```

**Database errors:**
```bash
rm carbontrace.db
python init_db.py
```

### Frontend Issues

**Port 3000 already in use:**
```bash
PORT=3001 npm start
```

**Cannot connect to backend:**
- Ensure backend is running on port 8000
- Check CORS configuration in backend/main.py

## Documentation

- `README.md` - Project overview
- `SETUP.md` - Detailed setup instructions
- `API_DOCUMENTATION.md` - Complete API reference
- `ARCHITECTURE.md` - Technical architecture
- `SUBMISSION.md` - Hackathon submission details

## License

MIT License - see LICENSE file for details
