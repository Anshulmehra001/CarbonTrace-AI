# CarbonTrace AI - API Documentation

## Base URL

```
Development: http://localhost:8000
Production: https://api.carbontrace.ai
```

## Authentication

All protected endpoints require a JWT Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/login

Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### Activities

#### GET /api/activities

Get all activities for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum records to return (default: 100)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "type": "transport",
    "category": "road_freight",
    "description": "Delivery truck - warehouse to customer",
    "quantity": 1,
    "unit": "trip",
    "distance_km": 250,
    "fuel_type": "diesel",
    "co2_kg": 62.75,
    "date": "2026-04-12T10:30:00",
    "created_at": "2026-04-12T10:30:00"
  }
]
```

#### POST /api/activities

Create a new activity.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "transport",
  "category": "road_freight",
  "description": "Delivery truck",
  "quantity": 1,
  "unit": "trip",
  "distance_km": 250,
  "fuel_type": "diesel",
  "date": "2026-04-17T00:00:00"
}
```

**Response (200 OK):**
```json
{
  "id": 2,
  "user_id": 1,
  "type": "transport",
  "category": "road_freight",
  "description": "Delivery truck",
  "quantity": 1,
  "unit": "trip",
  "distance_km": 250,
  "fuel_type": "diesel",
  "co2_kg": 62.75,
  "date": "2026-04-17T00:00:00",
  "created_at": "2026-04-17T14:23:45"
}
```

#### GET /api/activities/{activity_id}

Get a specific activity by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "type": "transport",
  "category": "road_freight",
  "description": "Delivery truck",
  "quantity": 1,
  "unit": "trip",
  "distance_km": 250,
  "fuel_type": "diesel",
  "co2_kg": 62.75,
  "date": "2026-04-17T00:00:00",
  "created_at": "2026-04-17T14:23:45"
}
```

#### DELETE /api/activities/{activity_id}

Delete an activity.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Activity deleted successfully"
}
```

---

### Dashboard

#### GET /api/dashboard/summary

Get dashboard summary statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "total_emissions_kg": 6168.15,
  "total_activities": 6,
  "recent_emissions_kg": 6168.15,
  "trend_percentage": 0.0,
  "by_type": {
    "transport": 5727.75,
    "energy": 253.4,
    "materials": 185.0,
    "waste": -7.5
  },
  "activity_count": 6
}
```

---

### Reports

#### GET /api/reports/generate

Generate a comprehensive ESG report.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `start_date` (optional): Start date in ISO format (YYYY-MM-DD)
- `end_date` (optional): End date in ISO format (YYYY-MM-DD)

**Response (200 OK):**
```json
{
  "report_date": "2026-04-17T14:30:00",
  "period": {
    "start": "2026-01-01",
    "end": "2026-04-17"
  },
  "summary": {
    "total_emissions_kg": 6168.15,
    "total_emissions_tonnes": 6.168,
    "total_activities": 6,
    "average_per_activity": 1028.03
  },
  "breakdown": {
    "transport": {
      "count": 2,
      "emissions_kg": 5727.75
    },
    "energy": {
      "count": 2,
      "emissions_kg": 253.4
    },
    "materials": {
      "count": 1,
      "emissions_kg": 185.0
    },
    "waste": {
      "count": 1,
      "emissions_kg": -7.5
    }
  },
  "recommendations": [
    {
      "priority": "high",
      "category": "transport",
      "current_emissions_kg": 5727.75,
      "percentage": 92.9,
      "recommendation": "Switch to electric vehicles or optimize route planning",
      "potential_reduction": "15-30%",
      "estimated_savings_kg": 1288.74
    }
  ]
}
```

---

### Predictions

#### GET /api/predictions/estimate

Estimate carbon emissions for an activity (no authentication required).

**Query Parameters:**
- `activity_type` (required): Type of activity (transport, energy, materials, waste)
- `category` (required): Specific category
- `quantity` (required): Amount of activity
- `distance_km` (optional): Distance for transport activities
- `fuel_type` (optional): Fuel type for transport activities

**Example Request:**
```
GET /api/predictions/estimate?activity_type=transport&category=road_freight&quantity=1&distance_km=100&fuel_type=diesel
```

**Response (200 OK):**
```json
{
  "co2_kg": 25.1,
  "co2_tonnes": 0.0251,
  "confidence": 0.95,
  "emission_factor": 0.251,
  "methodology": "GHG Protocol + ML Enhancement"
}
```

---

## Activity Types and Categories

### Transport
- **Categories**: road_freight, air_freight, sea_freight, rail_freight, passenger_car
- **Fuel Types**: diesel, petrol, electric, jet_fuel
- **Units**: trip, km
- **Required Fields**: distance_km, fuel_type

### Energy
- **Categories**: electricity_grid, natural_gas, coal, solar, wind
- **Units**: kWh, MWh
- **Required Fields**: quantity

### Materials
- **Categories**: steel, aluminum, concrete, plastic, paper, glass
- **Units**: kg, tonnes
- **Required Fields**: quantity

### Waste
- **Categories**: landfill, incineration, recycling, composting
- **Units**: kg, tonnes
- **Required Fields**: quantity

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid authentication credentials"
}
```

### 404 Not Found
```json
{
  "detail": "Activity not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

**Current Limits:**
- No rate limiting in development
- Production: 100 requests per minute per IP

---

## Code Examples

### Python

```python
import requests

# Login
response = requests.post(
    "http://localhost:8000/api/auth/login",
    json={"email": "demo@carbontrace.ai", "password": "demo123"}
)
token = response.json()["access_token"]

# Add activity
headers = {"Authorization": f"Bearer {token}"}
activity = {
    "type": "transport",
    "category": "road_freight",
    "distance_km": 100,
    "fuel_type": "diesel",
    "quantity": 1,
    "unit": "trip"
}
response = requests.post(
    "http://localhost:8000/api/activities",
    json=activity,
    headers=headers
)
print(response.json())
```

### JavaScript

```javascript
// Login
const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'demo@carbontrace.ai',
    password: 'demo123'
  })
});
const { access_token } = await loginResponse.json();

// Add activity
const activityResponse = await fetch('http://localhost:8000/api/activities', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    type: 'transport',
    category: 'road_freight',
    distance_km: 100,
    fuel_type: 'diesel',
    quantity: 1,
    unit: 'trip'
  })
});
const activity = await activityResponse.json();
console.log(activity);
```

### cURL

```bash
# Login
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@carbontrace.ai","password":"demo123"}'

# Add activity (replace TOKEN)
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

---

## Interactive Documentation

Visit **http://localhost:8000/docs** for interactive Swagger UI documentation where you can test all endpoints directly in your browser.

---

**API Version:** 1.0.0  
**Last Updated:** April 2026
