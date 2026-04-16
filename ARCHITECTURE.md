# CarbonTrace AI - Technical Architecture

## System Overview

CarbonTrace AI is a full-stack web application designed to track, analyze, and optimize carbon emissions for enterprises. The system follows a modern three-tier architecture with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         React Frontend (TypeScript/JavaScript)         │ │
│  │  - Dashboard  - Activities  - Reports  - Analytics     │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API (JSON)
                            │ JWT Authentication
┌───────────────────────────▼─────────────────────────────────┐
│                      Application Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              FastAPI Backend (Python)                  │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │   Auth       │  │   Business   │  │   ML Model  │ │ │
│  │  │   Service    │  │   Logic      │  │   Service   │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │ SQLAlchemy ORM
┌───────────────────────────▼─────────────────────────────────┐
│                        Data Layer                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         PostgreSQL / SQLite Database                   │ │
│  │  - Users  - Activities  - Reports  - Audit Logs       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (React)

**Technology Stack:**
- React 18 with functional components and hooks
- React Router for navigation
- Axios for HTTP requests
- Recharts for data visualization
- CSS3 for styling

**Key Components:**
- `Dashboard.js` - Main analytics dashboard with charts
- `Activities.js` - Activity list and management
- `AddActivity.js` - Form for adding new activities
- `Reports.js` - ESG report generation
- `Login.js` - Authentication interface
- `Navigation.js` - App navigation bar

**State Management:**
- Local state with useState hooks
- Authentication state in localStorage
- API calls with useEffect hooks

### Backend (FastAPI)

**Technology Stack:**
- FastAPI for REST API
- SQLAlchemy for ORM
- Pydantic for data validation
- JWT for authentication
- Uvicorn as ASGI server

**API Endpoints:**

```
Authentication:
POST   /api/auth/login       - User login
POST   /api/auth/register    - User registration

Activities:
GET    /api/activities       - List all activities
POST   /api/activities       - Create new activity
GET    /api/activities/{id}  - Get specific activity
DELETE /api/activities/{id}  - Delete activity

Dashboard:
GET    /api/dashboard/summary - Get dashboard statistics

Reports:
GET    /api/reports/generate  - Generate ESG report

Predictions:
GET    /api/predictions/estimate - Estimate emissions
```

**Key Modules:**
- `main.py` - FastAPI application and routes
- `models.py` - SQLAlchemy database models
- `schemas.py` - Pydantic validation schemas
- `database.py` - Database connection and session
- `auth.py` - JWT authentication logic
- `ml_model.py` - ML prediction engine

### Machine Learning Model

**EmissionPredictor Class:**

The ML model uses a hybrid approach:

1. **Rule-Based Factors**: Industry-standard emission factors from:
   - EPA (Environmental Protection Agency)
   - DEFRA (UK Department for Environment)
   - GHG Protocol

2. **Predictive Algorithm**: 
   - Input features: activity type, category, quantity, distance, fuel type
   - Calculation: Base emission factor × quantity × distance (if applicable)
   - Variance simulation: Adds realistic noise to simulate ML predictions
   - Confidence scoring: Returns confidence level for each prediction

**Emission Factors:**
```python
Transport: 0.011 - 1.133 kg CO2/km (varies by mode)
Energy: 0.011 - 0.385 kg CO2/kWh (varies by source)
Materials: 0.45 - 8.24 kg CO2/kg (varies by material)
Waste: -0.15 - 0.577 kg CO2/kg (negative = carbon savings)
```

### Database Schema

**Users Table:**
```sql
id              INTEGER PRIMARY KEY
email           VARCHAR UNIQUE NOT NULL
name            VARCHAR NOT NULL
hashed_password VARCHAR NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
```

**Activities Table:**
```sql
id              INTEGER PRIMARY KEY
user_id         INTEGER FOREIGN KEY -> users.id
type            VARCHAR NOT NULL (transport/energy/materials/waste)
category        VARCHAR NOT NULL
description     TEXT
quantity        FLOAT NOT NULL
unit            VARCHAR NOT NULL
distance_km     FLOAT
fuel_type       VARCHAR
co2_kg          FLOAT NOT NULL
date            TIMESTAMP
created_at      TIMESTAMP DEFAULT NOW()
```

## Data Flow

### Adding an Activity

1. User fills form in `AddActivity.js`
2. Optional: Click "Estimate Emissions" → GET `/api/predictions/estimate`
3. Submit form → POST `/api/activities` with JWT token
4. Backend validates data with Pydantic schemas
5. ML model calculates CO2 emissions
6. Activity saved to database via SQLAlchemy
7. Response returned to frontend
8. User redirected to activities list

### Generating a Report

1. User selects date range in `Reports.js`
2. Click "Generate Report" → GET `/api/reports/generate?start_date=X&end_date=Y`
3. Backend queries activities from database
4. Aggregates data by category
5. ML model generates recommendations
6. Report returned as JSON
7. Frontend displays formatted report
8. User can download as JSON

## Security

**Authentication:**
- JWT tokens with HS256 algorithm
- Tokens expire after 7 days
- Passwords hashed with bcrypt
- Bearer token authentication on protected routes

**API Security:**
- CORS enabled for specific origins
- Input validation with Pydantic
- SQL injection prevention via ORM
- Rate limiting (recommended for production)

**Data Protection:**
- Passwords never stored in plain text
- Sensitive data not logged
- Environment variables for secrets

## Scalability Considerations

**Current Architecture:**
- SQLite for development (single file database)
- Single server deployment
- Synchronous request handling

**Production Recommendations:**
1. **Database**: Migrate to PostgreSQL for concurrent access
2. **Caching**: Add Redis for session management and caching
3. **Load Balancing**: Deploy multiple backend instances behind nginx
4. **CDN**: Serve frontend static assets via CDN
5. **Background Jobs**: Use Celery for async report generation
6. **Monitoring**: Add Prometheus + Grafana for metrics
7. **Logging**: Centralized logging with ELK stack

## Performance Optimization

**Frontend:**
- Code splitting with React.lazy()
- Memoization with useMemo/useCallback
- Debounced API calls
- Lazy loading for charts

**Backend:**
- Database query optimization with indexes
- Connection pooling
- Response caching for dashboard
- Pagination for large datasets

**Database:**
```sql
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_date ON activities(date);
CREATE INDEX idx_activities_type ON activities(type);
```

## Deployment

**Development:**
```bash
# Backend
cd backend && uvicorn main:app --reload

# Frontend
cd frontend && npm start
```

**Production:**
```bash
# Docker Compose
docker-compose up -d

# Or manual deployment
# Backend: gunicorn + uvicorn workers
# Frontend: npm run build + nginx
```

## Testing Strategy

**Unit Tests:**
- Backend: pytest for API endpoints
- Frontend: Jest + React Testing Library

**Integration Tests:**
- End-to-end API testing
- Database transaction tests

**E2E Tests:**
- Cypress for user workflows
- Critical paths: login, add activity, generate report

## Monitoring & Observability

**Metrics to Track:**
- API response times
- Error rates
- Database query performance
- User activity patterns
- Carbon calculation accuracy

**Logging:**
- Structured JSON logs
- Log levels: DEBUG, INFO, WARNING, ERROR
- Request/response logging
- Error stack traces

## Future Enhancements

1. **Real-time Updates**: WebSocket for live dashboard
2. **Advanced ML**: LSTM models for time-series forecasting
3. **Blockchain**: Carbon credit tokenization
4. **Mobile Apps**: React Native for iOS/Android
5. **Integrations**: SAP, Oracle, Salesforce connectors
6. **Multi-tenancy**: Support for multiple organizations
7. **Advanced Analytics**: Predictive insights and anomaly detection

---

**Document Version:** 1.0  
**Last Updated:** April 2026  
**Maintained By:** CarbonTrace AI Team
