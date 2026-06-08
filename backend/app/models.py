from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import Column, Float, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(SQLAlchemyBaseUserTableUUID, Base):
    pass

class PatientAssessment(Base):
    __tablename__ = "patient_assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(ForeignKey("user.id"), nullable=False)
    
    # Risk calculation results
    risk_score = Column(Float, nullable=False)
    status = Column(String, nullable=False)
    
    # Original Data Inputs
    HighBP = Column(Float)
    HighChol = Column(Float)
    BMI = Column(Float)
    Smoker = Column(Float)
    Stroke = Column(Float)
    HeartDiseaseorAttack = Column(Float)
    PhysActivity = Column(Float)
    Fruits = Column(Float)
    Veggies = Column(Float)
    HvyAlcoholConsump = Column(Float)
    AnyHealthcare = Column(Float)
    NoDocbcCost = Column(Float)
    GenHlth = Column(Float)
    MentHlth = Column(Float)
    PhysHlth = Column(Float)
    DiffWalk = Column(Float)
    Sex = Column(Float)
    Age = Column(Float)
    Education = Column(Float)
    Income = Column(Float)
