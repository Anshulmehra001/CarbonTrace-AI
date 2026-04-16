# CarbonTrace AI - Quick Start Guide

## Get Running in 5 Minutes

### Prerequisites Check

Before starting, make sure you have:
- ✅ Python 3.8 or higher (`python --version`)
- ✅ Node.js 16 or higher (`node --version`)
- ✅ npm or yarn (`npm --version`)

---

## Step 1: Backend Setup (2 minutes)

Open your terminal and run:

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

# Initialize database with demo data
python init_db.py

# Start the backend server
uvicorn main:app --reload
```

✅ **Backend is now running on http://localhost:8000**

Keep this terminal open!

---

## Step 2: Frontend Setup (2 minutes)

Open a **NEW** terminal and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

✅ **Frontend is now running on http://localhost:3000**

Your browser should automatically open to http://localhost:3000

---

## Step 3: Login & Explore (1 minute)

### Demo Credentials
```
Email: demo@carbontrace.ai
Password: demo123
```

### What to Try

1. **Dashboard** - View carbon footprint overview
   - See total emissions: 6,168 kg CO₂
   - View pie chart breakdown
   - Check recent activities

2. **Activities** - See all tracked activities
   - 6 sample activities included
   - Transport, energy, materials, waste

3. **Add Activity** - Track new emission
   - Select "Transport" → "Road Freight"
   - Distance: 100 km
   - Fuel: Diesel
   - Click "Estimate Emissions" to see prediction
   - Click "Add Activity" to save

4. **Reports** - Generate ESG report
   - Click "Generate Report"
   - View comprehensive breakdown
   - See AI recommendations
   - Download as JSON

---

## Setup Complete

You now have a fully functional carbon tracking platform running locally.

---

## Quick Troubleshooting

### Backend Issues

**Problem:** Port 8000 already in use
```bash
# Use different port
uvicorn main:app --reload --port 8001
```

**Problem:** Module not found
```bash
# Make sure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

**Problem:** Database error
```bash
# Delete and recreate database
rm carbontrace.db
python init_db.py
```

### Frontend Issues

**Problem:** Port 3000 already in use
```bash
# Set different port
PORT=3001 npm start
```

**Problem:** npm install fails
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

**Problem:** Can't connect to backend
- Make sure backend is running on port 8000
- Check browser console for CORS errors
- Verify API_URL in code points to http://localhost:8000

---

## API Testing

### Interactive API Docs

Visit **http://localhost:8000/docs** for Swagger UI

### Quick API Test

```bash
# Get access token
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@carbontrace.ai","password":"demo123"}'

# Copy the access_token from response

# Get dashboard summary (replace YOUR_TOKEN)
curl -X GET "http://localhost:8000/api/dashboard/summary" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Docker Alternative (Optional)

If you prefer Docker:

```bash
# Build and run everything
docker-compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

---

## Next Steps

### Customize the Platform

1. **Add More Emission Factors**
   - Edit `backend/ml_model.py`
   - Add new categories and factors

2. **Customize UI**
   - Edit CSS files in `frontend/src/components/`
   - Change colors, fonts, layouts

3. **Add Features**
   - Implement user management
   - Add more chart types
   - Create custom reports

### Deploy to Production

1. **Backend**
   - Use PostgreSQL instead of SQLite
   - Set environment variables
   - Deploy to Heroku, AWS, or DigitalOcean

2. **Frontend**
   - Build production bundle: `npm run build`
   - Deploy to Vercel, Netlify, or AWS S3

### Learn More

- 📖 Read `README.md` for detailed overview
- 🏗️ Check `ARCHITECTURE.md` for technical details
- 📚 Review `API_DOCUMENTATION.md` for API reference
- 🔧 See `SETUP.md` for advanced configuration

---

## Common Commands

### Backend
```bash
# Start server
uvicorn main:app --reload

# Reset database
python init_db.py

# Run with different port
uvicorn main:app --reload --port 8001
```

### Frontend
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Docker
```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up --build
```

---

## Demo Walkthrough

### Scenario: Track a Delivery Truck

1. Login with demo credentials
2. Click "Add Activity"
3. Fill in:
   - Type: Transport
   - Category: Road Freight
   - Distance: 250 km
   - Fuel: Diesel
   - Quantity: 1
   - Unit: trip
4. Click "Estimate Emissions" → See ~62.75 kg CO₂
5. Click "Add Activity"
6. Go to Dashboard → See updated total
7. Go to Reports → Generate report with new data

---

## Support

### Need Help?

- 📧 Email: [Your Email]
- 💬 GitHub Issues: [Your Repo]
- 📖 Documentation: See all .md files in project

### Found a Bug?

1. Check existing issues on GitHub
2. Create new issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

---

## What's Included

✅ **Backend API** - FastAPI with 12 endpoints  
✅ **Frontend UI** - React with 5 pages  
✅ **ML Model** - Emission prediction engine  
✅ **Database** - SQLite with sample data  
✅ **Documentation** - 6 comprehensive guides  
✅ **Docker** - Ready-to-deploy containers  

---

## Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can login with demo credentials
- [ ] Dashboard shows data and charts
- [ ] Can add new activity
- [ ] Can generate report
- [ ] API docs accessible at /docs

---

**🎯 Goal:** Get you up and running in 5 minutes  
**⏱️ Actual Time:** 5-10 minutes (including downloads)  
**💪 Difficulty:** Easy  

---

For more detailed information, see SETUP.md and README.md
