from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ActivityCreate(BaseModel):
    type: str  # transport, energy, materials, waste
    category: str
    description: Optional[str] = None
    quantity: float
    unit: str
    distance_km: Optional[float] = None
    fuel_type: Optional[str] = None
    date: Optional[datetime] = None

class ActivityResponse(BaseModel):
    id: int
    user_id: int
    type: str
    category: str
    description: Optional[str]
    quantity: float
    unit: str
    distance_km: Optional[float]
    fuel_type: Optional[str]
    co2_kg: float
    date: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True
