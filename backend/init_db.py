"""
Initialize database with sample data
"""
from database import engine, SessionLocal
import models
from auth import get_password_hash
from datetime import datetime, timedelta
import random

# Create all tables
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Create demo user
demo_user = models.User(
    email="demo@carbontrace.ai",
    name="Demo User",
    hashed_password=get_password_hash("demo123")
)

db.add(demo_user)
db.commit()
db.refresh(demo_user)

# Create sample activities
sample_activities = [
    {
        "type": "transport",
        "category": "road_freight",
        "description": "Delivery truck - warehouse to customer",
        "quantity": 1,
        "unit": "trip",
        "distance_km": 250,
        "fuel_type": "diesel",
        "co2_kg": 62.75,
        "date": datetime.utcnow() - timedelta(days=5)
    },
    {
        "type": "energy",
        "category": "electricity_grid",
        "description": "Office electricity consumption",
        "quantity": 500,
        "unit": "kWh",
        "distance_km": None,
        "fuel_type": None,
        "co2_kg": 192.5,
        "date": datetime.utcnow() - timedelta(days=10)
    },
    {
        "type": "materials",
        "category": "steel",
        "description": "Steel procurement for manufacturing",
        "quantity": 100,
        "unit": "kg",
        "distance_km": None,
        "fuel_type": None,
        "co2_kg": 185.0,
        "date": datetime.utcnow() - timedelta(days=15)
    },
    {
        "type": "waste",
        "category": "recycling",
        "description": "Cardboard and paper recycling",
        "quantity": 50,
        "unit": "kg",
        "distance_km": None,
        "fuel_type": None,
        "co2_kg": -7.5,
        "date": datetime.utcnow() - timedelta(days=3)
    },
    {
        "type": "transport",
        "category": "air_freight",
        "description": "International shipment",
        "quantity": 1,
        "unit": "shipment",
        "distance_km": 5000,
        "fuel_type": "jet_fuel",
        "co2_kg": 5665.0,
        "date": datetime.utcnow() - timedelta(days=20)
    },
    {
        "type": "energy",
        "category": "natural_gas",
        "description": "Heating - office building",
        "quantity": 300,
        "unit": "kWh",
        "distance_km": None,
        "fuel_type": None,
        "co2_kg": 60.9,
        "date": datetime.utcnow() - timedelta(days=7)
    },
]

for activity_data in sample_activities:
    activity = models.Activity(
        user_id=demo_user.id,
        **activity_data
    )
    db.add(activity)

db.commit()

print("✅ Database initialized successfully!")
print(f"✅ Demo user created: demo@carbontrace.ai / demo123")
print(f"✅ {len(sample_activities)} sample activities added")
print("\n🚀 You can now start the server with: uvicorn main:app --reload")

db.close()
