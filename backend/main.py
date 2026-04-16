from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import models
import schemas
from database import engine, get_db
from ml_model import EmissionPredictor
import auth

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CarbonTrace AI API",
    description="Real-Time Carbon Footprint Intelligence Platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML model
predictor = EmissionPredictor()
security = HTTPBearer()

# Auth dependency
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = auth.verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    return payload

@app.get("/")
def root():
    return {
        "message": "Welcome to CarbonTrace AI API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.post("/api/auth/login")
def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    
    if not user or not auth.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = auth.create_access_token(data={"sub": user.email, "id": user.id})
    return {"access_token": access_token, "token_type": "bearer", "user": {"email": user.email, "name": user.name}}

@app.post("/api/auth/register")
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user_data.password)
    new_user = models.User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = auth.create_access_token(data={"sub": new_user.email, "id": new_user.id})
    return {"access_token": access_token, "token_type": "bearer", "user": {"email": new_user.email, "name": new_user.name}}

@app.post("/api/activities", response_model=schemas.ActivityResponse)
def create_activity(
    activity: schemas.ActivityCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Calculate emissions using ML model
    emission_data = predictor.predict_emission(
        activity_type=activity.type,
        category=activity.category,
        quantity=activity.quantity,
        distance_km=activity.distance_km,
        fuel_type=activity.fuel_type
    )
    
    new_activity = models.Activity(
        user_id=current_user["id"],
        type=activity.type,
        category=activity.category,
        description=activity.description,
        quantity=activity.quantity,
        unit=activity.unit,
        distance_km=activity.distance_km,
        fuel_type=activity.fuel_type,
        co2_kg=emission_data["co2_kg"],
        date=activity.date or datetime.utcnow()
    )
    
    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)
    
    return new_activity

@app.get("/api/activities", response_model=List[schemas.ActivityResponse])
def get_activities(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    activities = db.query(models.Activity).filter(
        models.Activity.user_id == current_user["id"]
    ).offset(skip).limit(limit).all()
    return activities

@app.get("/api/activities/{activity_id}", response_model=schemas.ActivityResponse)
def get_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    activity = db.query(models.Activity).filter(
        models.Activity.id == activity_id,
        models.Activity.user_id == current_user["id"]
    ).first()
    
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    return activity

@app.delete("/api/activities/{activity_id}")
def delete_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    activity = db.query(models.Activity).filter(
        models.Activity.id == activity_id,
        models.Activity.user_id == current_user["id"]
    ).first()
    
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    db.delete(activity)
    db.commit()
    
    return {"message": "Activity deleted successfully"}

@app.get("/api/dashboard/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    activities = db.query(models.Activity).filter(
        models.Activity.user_id == current_user["id"]
    ).all()
    
    total_emissions = sum(a.co2_kg for a in activities)
    
    # Group by type
    by_type = {}
    for activity in activities:
        if activity.type not in by_type:
            by_type[activity.type] = 0
        by_type[activity.type] += activity.co2_kg
    
    # Recent activities (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_activities = [a for a in activities if a.date >= thirty_days_ago]
    recent_emissions = sum(a.co2_kg for a in recent_activities)
    
    # Calculate trend
    sixty_days_ago = datetime.utcnow() - timedelta(days=60)
    previous_period = [a for a in activities if sixty_days_ago <= a.date < thirty_days_ago]
    previous_emissions = sum(a.co2_kg for a in previous_period)
    
    trend = 0
    if previous_emissions > 0:
        trend = ((recent_emissions - previous_emissions) / previous_emissions) * 100
    
    return {
        "total_emissions_kg": round(total_emissions, 2),
        "total_activities": len(activities),
        "recent_emissions_kg": round(recent_emissions, 2),
        "trend_percentage": round(trend, 1),
        "by_type": {k: round(v, 2) for k, v in by_type.items()},
        "activity_count": len(activities)
    }

@app.get("/api/reports/generate")
def generate_report(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    query = db.query(models.Activity).filter(models.Activity.user_id == current_user["id"])
    
    if start_date:
        query = query.filter(models.Activity.date >= datetime.fromisoformat(start_date))
    if end_date:
        query = query.filter(models.Activity.date <= datetime.fromisoformat(end_date))
    
    activities = query.all()
    
    total_emissions = sum(a.co2_kg for a in activities)
    
    by_category = {}
    for activity in activities:
        cat = activity.category or activity.type
        if cat not in by_category:
            by_category[cat] = {"count": 0, "emissions": 0}
        by_category[cat]["count"] += 1
        by_category[cat]["emissions"] += activity.co2_kg
    
    return {
        "report_date": datetime.utcnow().isoformat(),
        "period": {
            "start": start_date or "all time",
            "end": end_date or "present"
        },
        "summary": {
            "total_emissions_kg": round(total_emissions, 2),
            "total_emissions_tonnes": round(total_emissions / 1000, 3),
            "total_activities": len(activities),
            "average_per_activity": round(total_emissions / len(activities), 2) if activities else 0
        },
        "breakdown": {k: {"count": v["count"], "emissions_kg": round(v["emissions"], 2)} for k, v in by_category.items()},
        "recommendations": predictor.get_recommendations(total_emissions, by_category)
    }

@app.get("/api/predictions/estimate")
def estimate_emission(
    activity_type: str,
    category: str,
    quantity: float,
    distance_km: Optional[float] = None,
    fuel_type: Optional[str] = None
):
    result = predictor.predict_emission(
        activity_type=activity_type,
        category=category,
        quantity=quantity,
        distance_km=distance_km,
        fuel_type=fuel_type
    )
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
