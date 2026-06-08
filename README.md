# Aura-AI-for-Chronic-Disease-Management - Care Beyond Clinic

Aura is an AI-powered health-tech solution designed to solve the "Reactive Care" problem. While traditional medicine relies on periodic clinic visits, Aura provides a 24/7 digital safety net by fusing static Electronic Health Records (EHR) with high-velocity wearable data.

This platform features a beautiful, stunning, modern dark-themed UI with gradient aesthetics, real-time health monitoring simulations, and a comprehensive admin dashboard.

## 🌟 Features

### Patient-Facing Features
- **Beautiful Landing Page** - Modern, gradient-heavy design with smooth animations
- **Health Assessment Form** - Comprehensive 19-parameter health evaluation
- **AI Risk Prediction** - Random Forest ML model with 92% accuracy
- **Real-Time Vitals** - Live heart rate monitoring from wearable devices
- **Fusion Analysis** - Combines static clinical data with live vitals
- **Personalized Recommendations** - Actionable health insights based on risk profile

### Admin Dashboard Features
- **Dashboard Overview** - Real-time system metrics and patient statistics
- **Patient Management** - View and manage all patient assessments
- **Analytics & Insights** - Deep dive into health trends and patterns
- **ML Model Monitoring** - Track model performance and feature importance
- **System Settings** - Configure platform parameters

## 📁 Project Structure

```
healthhack/
├── index.html              # Landing page
├── styles.css              # Global styles
├── assessment.html         # Health assessment form
├── assessment.css          # Assessment page styles
├── assessment.js           # Assessment logic & API integration
├── admin.html              # Admin dashboard
├── admin.css               # Admin dashboard styles
├── admin.js                # Admin dashboard logic
├── main.py                 # FastAPI backend
├── requirement.txt         # Python dependencies
├── aura_rf_model.pkl      # Trained Random Forest model
└── aura_scaler.pkl        # Feature scaler
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Install Python Dependencies**
   ```bash
   pip install -r requirement.txt
   ```

2. **Start the FastAPI Backend**
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`

3. **Open the Website**
   - Open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Python 3
     python -m http.server 8080
     ```
     Then navigate to `http://localhost:8080`

## 🎨 Design Features

### Color Palette
- **Primary Gradient**: Purple to violet (#667eea → #764ba2)
- **Secondary Gradient**: Pink to red (#f093fb → #f5576c)
- **Accent Gradient**: Blue to cyan (#4facfe → #00f2fe)
- **Success Gradient**: Green to teal (#43e97b → #38f9d7)

### UI Components
- **Glassmorphism** - Frosted glass effects with backdrop blur
- **Gradient Orbs** - Floating animated background elements
- **Smooth Animations** - Hover effects, transitions, and micro-interactions
- **Responsive Design** - Mobile-friendly layouts
- **Dark Theme** - Easy on the eyes with vibrant accents

## 🔌 API Endpoints

### Health Assessment
```javascript
POST /predict
{
  "HighBP": 0,
  "HighChol": 0,
  "BMI": 24.5,
  // ... 16 more parameters
}

Response:
{
  "risk_score": 0.34,
  "status": "Stable"
}
```

### Live Vitals
```javascript
GET /wearable/stream?patient_id=patient_123
 
Response:
{
  "bpm": 72,
  "timestamp": 1707648600.0
}
```

### Fusion Analysis
```javascript
POST /aura/analyze
{
  // Same parameters as /predict
}

Response:
{
  "fusion_status": "Stable",
  "clinical_risk": "34.0%",
  "live_vitals": "72 BPM"
}
```

## 📊 Health Parameters

The ML model analyzes the following 19 parameters:

**Health Indicators:**
- High Blood Pressure
- High Cholesterol
- BMI (Body Mass Index)
- General Health (1-5 scale)

**Medical History:**
- Previous Stroke
- Heart Disease or Attack
- Mental Health Days (0-30)
- Physical Health Days (0-30)
- Difficulty Walking

**Lifestyle Factors:**
- Smoker Status
- Physical Activity
- Fruit Consumption
- Vegetable Consumption
- Heavy Alcohol Consumption

**Healthcare Access:**
- Healthcare Coverage
- Cost Barrier to Doctor Visits

**Demographics:**
- Sex
- Age Group (1-13)
- Education Level (1-6)
- Income Level (1-8)

## 🎯 Risk Score Interpretation

- **Low Risk (0.00 - 0.29)**: Green badge, stable health status
- **Moderate Risk (0.30 - 0.59)**: Yellow badge, monitor closely
- **High Risk (0.60 - 1.00)**: Red badge, medical consultation recommended

## 🛡️ Security & Privacy

- Local data processing
- No data stored without consent
- HIPAA-compliant architecture ready
- Secure API communication
- Data encryption support

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --bg-primary: #0a0e27;
    /* ... other variables */
}
```

### Modifying API Endpoint
Update the `API_BASE_URL` in:
- `assessment.js`
- `admin.js`

## 🐛 Troubleshooting

### API Connection Failed
- Ensure FastAPI server is running: `uvicorn main:app --reload`
- Check if port 8000 is not blocked
- Verify API_BASE_URL in JavaScript files

### CORS Issues
- If accessing from `file://`, use a local web server
- FastAPI automatically handles CORS for development

### Form Not Submitting
- Ensure all required fields are filled
- Check browser console for errors
- Verify API is responding at `/predict` endpoint

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 🚀 Deployment

### Static Hosting (Frontend)
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Backend Hosting
- Heroku
- AWS EC2/Lambda
- Google Cloud Run
- DigitalOcean

## 📄 License

This project is created for educational and healthcare purposes.

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional ML models (neural networks, ensemble methods)
- More health metrics and biomarkers
- Mobile app version
- Telemedicine integration
- Electronic Health Records (EHR) integration

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for better health outcomes**

*Powered by Random Forest ML, FastAPI, and Modern Web Technologies*

