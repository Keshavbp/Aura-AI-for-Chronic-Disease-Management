from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import onnxruntime as ort
import numpy as np
import pandas as pd
import random
import time
import os
import contextlib

from sqlalchemy.ext.asyncio import AsyncSession
from .schemas import PatientData, UserRead, UserCreate, UserUpdate
from .models import User, PatientAssessment
from .auth import auth_backend, fastapi_users, current_active_user
from .database import engine, Base, get_async_session

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Automatically create database tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="Aura Health-Tech API", lifespan=lifespan)

# Restrict CORS middleware to local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Resolve paths dynamically relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(BASE_DIR))
model_path = os.path.join(PROJECT_ROOT, "models", "aura_model.onnx")
scaler_path = os.path.join(PROJECT_ROOT, "models", "aura_scaler.onnx")
frontend_dir = os.path.join(PROJECT_ROOT, "frontend")

# Load the ML models securely via ONNX Runtime
model_session = ort.InferenceSession(model_path)
scaler_session = ort.InferenceSession(scaler_path)

# Mount static directories
app.mount("/css", StaticFiles(directory=os.path.join(frontend_dir, "css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(frontend_dir, "js")), name="js")

# Auth Routers
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

@app.get("/")
def read_root():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

@app.get("/login.html")
@app.get("/login")
def read_login():
    return FileResponse(os.path.join(frontend_dir, "login.html"))

@app.get("/index.html")
def read_index():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

@app.get("/assessment.html")
@app.get("/assessment")
def read_assessment():
    return FileResponse(os.path.join(frontend_dir, "assessment.html"))

@app.get("/admin.html")
@app.get("/admin")
def read_admin():
    return FileResponse(os.path.join(frontend_dir, "admin.html"))

@app.get("/test_connection.html")
@app.get("/test_connection")
def read_test_connection():
    return FileResponse(os.path.join(frontend_dir, "test_connection.html"))

@app.get("/status")
def status():
    return {"message": "Aura Backend is Online"}

@app.post("/predict")
async def predict_risk(
    data: PatientData, 
    user: User = Depends(fastapi_users.current_user(active=True, optional=True)),
    session: AsyncSession = Depends(get_async_session)
):
    # Convert input to float32 numpy array
    input_data = pd.DataFrame([data.model_dump()]).astype(np.float32).values
    
    # Scale and Predict using ONNX
    scaler_inputs = {scaler_session.get_inputs()[0].name: input_data}
    scaled_data = scaler_session.run(None, scaler_inputs)[0]
    
    model_inputs = {model_session.get_inputs()[0].name: scaled_data}
    preds = model_session.run(None, model_inputs)
    
    prediction = preds[0][0]
    probability = preds[1][0][1]
    
    status_label = "High Risk" if prediction[0] == 1 else "Stable"
    risk_score = round(float(probability), 2)
    
    # Optionally save to DB if logged in
    if user:
        assessment = PatientAssessment(
            user_id=user.id,
            risk_score=risk_score,
            status=status_label,
            **data.model_dump()
        )
        session.add(assessment)
        await session.commit()
    
    return {
        "risk_score": risk_score,
        "status": status_label
    }

# Simulation: Latest heart rate memory
current_heart_rate = {"bpm": 72, "timestamp": time.time()}

@app.get("/wearable/stream")
def get_live_data(patient_id: str):
    """Simulates a live heart rate stream from a wearable."""
    if "risk" in patient_id.lower():
        new_bpm = random.randint(100, 140) # Simulate Tachycardia
    else:
        new_bpm = random.randint(65, 85)
        
    current_heart_rate["bpm"] = new_bpm
    current_heart_rate["timestamp"] = time.time()
    
    return current_heart_rate

@app.post("/aura/analyze")
def full_fusion_analysis(data: PatientData):
    input_data = pd.DataFrame([data.model_dump()]).astype(np.float32).values
    
    scaler_inputs = {scaler_session.get_inputs()[0].name: input_data}
    scaled_data = scaler_session.run(None, scaler_inputs)[0]
    
    model_inputs = {model_session.get_inputs()[0].name: scaled_data}
    preds = model_session.run(None, model_inputs)
    
    static_prob = preds[1][0][1]
    
    live_bpm = current_heart_rate["bpm"]
    
    status = "Stable"
    if static_prob > 0.6 and live_bpm > 100:
        status = "CRITICAL: High Risk Patient + Elevated Heart Rate"
    elif static_prob > 0.6:
        status = "Warning: Monitor Vitals Closely"
    elif live_bpm > 120:
        status = "Warning: Acute Tachycardia Detected"

    return {
        "fusion_status": status,
        "clinical_risk": f"{round(static_prob * 100, 1)}%",
        "live_vitals": f"{live_bpm} BPM"
    }

from sqlalchemy import select

# Secure admin endpoint example
@app.get("/admin/data")
async def get_admin_data(user: User = Depends(current_active_user)):
    return {"message": f"Hello {user.email}, you are authenticated to see admin data!"}

@app.get("/admin/patients")
async def get_admin_patients(user: User = Depends(current_active_user), session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(PatientAssessment).order_by(PatientAssessment.id.desc()).limit(50))
    assessments = result.scalars().all()
    return assessments
