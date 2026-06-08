import uuid
from pydantic import BaseModel, Field
from fastapi_users import schemas

# FastAPI Users default schemas
class UserRead(schemas.BaseUser[uuid.UUID]):
    pass

class UserCreate(schemas.BaseUserCreate):
    pass

class UserUpdate(schemas.BaseUserUpdate):
    pass

# Constrained patient data schema for risk prediction
class PatientData(BaseModel):
    HighBP: float = Field(ge=0, le=1)
    HighChol: float = Field(ge=0, le=1)
    CholCheck: float = Field(default=1.0, ge=0, le=1) # Default to 1 (checked)
    BMI: float = Field(ge=10, le=100) # Sensible BMI bounds
    Smoker: float = Field(ge=0, le=1)
    Stroke: float = Field(ge=0, le=1)
    HeartDiseaseorAttack: float = Field(ge=0, le=1)
    PhysActivity: float = Field(ge=0, le=1)
    Fruits: float = Field(ge=0, le=1)
    Veggies: float = Field(ge=0, le=1)
    HvyAlcoholConsump: float = Field(ge=0, le=1)
    AnyHealthcare: float = Field(ge=0, le=1)
    NoDocbcCost: float = Field(ge=0, le=1)
    GenHlth: float = Field(ge=1, le=5)
    MentHlth: float = Field(ge=0, le=30)
    PhysHlth: float = Field(ge=0, le=30)
    DiffWalk: float = Field(ge=0, le=1)
    Sex: float = Field(ge=0, le=1)
    Age: float = Field(ge=1, le=13) # Age groups in CDC dataset
    Education: float = Field(ge=1, le=6)
    Income: float = Field(ge=1, le=8)
