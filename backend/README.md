# Aura AI - FastAPI Backend & Unified Server

This directory contains the FastAPI backend logic and serves the integrated frontend static files.

## 🚀 Setup & Execution

### 1. Prerequisites
Ensure you have installed the workspace dependencies located at the project root:
```bash
pip install -r ../requirements.txt
```

### 2. Start the Server
Run the FastAPI application from this directory (`backend`):
```bash
uvicorn app.main:app --reload
```

The unified server will launch at `http://127.0.0.1:8000`.

---

## 📂 Layout Overview

*   `app/main.py`: Main backend entrypoint that hosts ML endpoints and serves all static routes.
*   `../models/`: Houses the pre-trained scikit-learn models (`aura_rf_model.pkl`, `aura_scaler.pkl`).
*   `../frontend/`: Static assets folder (HTML, CSS, JS) mounted by FastAPI.

---

## 🔌 Unified Server Routing

With the professional restructuring, you only need to run the FastAPI server to access the full application:

*   **Landing Page**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
*   **Health Assessment Form**: [http://127.0.0.1:8000/assessment](http://127.0.0.1:8000/assessment)
*   **Admin Dashboard**: [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)
*   **Connection Checker**: [http://127.0.0.1:8000/test_connection](http://127.0.0.1:8000/test_connection)
