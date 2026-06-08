from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import joblib
import pandas as pd
import random
import time
import os

app = FastAPI(title="Aura Health-Tech API")

# Add CORS middleware to allow frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Resolve paths dynamically relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(BASE_DIR))
model_path = os.path.join(PROJECT_ROOT, "models", "aura_rf_model.pkl")
scaler_path = os.path.join(PROJECT_ROOT, "models", "aura_scaler.pkl")
frontend_dir = os.path.join(PROJECT_ROOT, "frontend")

# Load the ML models
model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

# Define what a 'Patient' looks like based on the dataset features
class PatientData(BaseModel):
    HighBP: float
    HighChol: float
    BMI: float
    Smoker: float
    Stroke: float
    HeartDiseaseorAttack: float
    PhysActivity: float
    Fruits: float
    Veggies: float
    HvyAlcoholConsump: float
    AnyHealthcare: float
    NoDocbcCost: float
    GenHlth: float
    MentHlth: float
    PhysHlth: float
    DiffWalk: float
    Sex: float
    Age: float
    Education: float
    Income: float

# Mount static directories
app.mount("/css", StaticFiles(directory=os.path.join(frontend_dir, "css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(frontend_dir, "js")), name="js")

@app.get("/")
def read_root():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

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
def predict_risk(data: PatientData):
    # Convert input to DataFrame for the scaler
    input_df = pd.DataFrame([data.dict()])
    
    # Scale and Predict
    scaled_data = scaler.transform(input_df)
    prediction = model.predict(scaled_data)
    probability = model.predict_proba(scaled_data)[0][1]
    
    return {
        "risk_score": round(float(probability), 2),
        "status": "High Risk" if prediction[0] == 1 else "Stable"
    }


# Simulation: Latest heart rate memory
current_heart_rate = {"bpm": 72, "timestamp": time.time()}

@app.get("/wearable/stream")
def get_live_data(patient_id: str):
    """Simulates a live heart rate stream from a wearable."""
    # Logic: Base HR (70) + random fluctuation. 
    # If it's a 'high risk' ID, we can trigger a spike.
    if "risk" in patient_id.lower():
        new_bpm = random.randint(100, 140) # Simulate Tachycardia
    else:
        new_bpm = random.randint(65, 85)
        
    current_heart_rate["bpm"] = new_bpm
    current_heart_rate["timestamp"] = time.time()
    
    return current_heart_rate
@app.post("/aura/analyze")
def full_fusion_analysis(data: PatientData):
    # 1. Get Static Risk (Random Forest)
    input_df = pd.DataFrame([data.dict()])
    scaled_data = scaler.transform(input_df)
    static_prob = model.predict_proba(scaled_data)[0][1]
    
    # 2. Check Live Vitals (Simulated)
    # In a real app, this would query your InfluxDB/Kinesis stream
    live_bpm = current_heart_rate["bpm"]
    
    # 3. Fusion Logic: Triage
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
