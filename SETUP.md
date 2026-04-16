# CarbonTrace AI - Setup Guide

## Quick Start (5 minutes)

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database with sample data
python init_db.py

# Start the backend server
python -m uvicorn main:app --reload
```

Backend will run on: **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

### Step 2: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend will run on: **http://localhost:3000**

### Step 3: Login

Use the demo credentials:
- **Email:** demo@carbontrace.ai
- **Password:** demo123

## Docker Setup (Alternative)

If you prefer Docker:

```bash
# Build and run with Docker Compose
docker-compose up --build
```

This will start both backend and frontend automatically.

## Testing the Application

1. **Login** with demo credentials
2. **View Dashboard** - See sample carbon footprint data
3. **Add Activity** - Track a new carbon emission activity
4. **View Activities** - See all tracked activities
5. **Generate Report** - Create ESG compliance reports

## API Testing

Visit **http://localhost:8000/docs** for interactive API documentation.

Example API call:

```bash
# Get access token
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@carbontrace.ai","password":"demo123"}'

# Add activity (replace TOKEN with actual token)
curl -X POST "http://localhost:8000/api/activities" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "transport",
    "category": "road_freight",
    "distance_km": 100,
    "fuel_type": "diesel",
    "quantity": 1,
    "unit": "trip"
  }'
```

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Change port in command
uvicorn main:app --reload --port 8001
```

**Database errors:**
```bash
# Delete and recreate database
rm carbontrace.db
python init_db.py
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Set different port
PORT=3001 npm start
```

**CORS errors:**
- Make sure backend is running on port 8000
- Check that CORS middleware is configured in backend/main.py

## Production Deployment

### Backend

1. Set environment variables:
```bash
export DATABASE_URL=postgresql://user:pass@host:5432/dbname
export SECRET_KEY=your-secure-secret-key
```

2. Use production server:
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend

1. Build production bundle:
```bash
npm run build
```

2. Serve with nginx or deploy to Vercel/Netlify

## Next Steps

- Customize emission factors in `backend/ml_model.py`
- Add more activity types
- Integrate with external APIs (ERP, logistics systems)
- Set up PostgreSQL for production
- Add authentication with OAuth
- Implement role-based access control

## Support

For issues or questions:
- Check the README.md
- Review API docs at /docs
- Open an issue on GitHub

---

**Built for Orion Build Challenge 2026** 🌍
