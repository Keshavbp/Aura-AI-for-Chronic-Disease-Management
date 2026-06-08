// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// Form Elements
const form = document.getElementById('assessmentForm');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const resultsPanel = document.getElementById('resultsPanel');
const submitBtn = document.getElementById('submitBtn');

// Patient ID for wearable simulation (can be customized)
let patientId = 'patient_' + Date.now();

// Track form completion progress
function updateProgress() {
    const formInputs = form.querySelectorAll('input, select');
    const totalFields = formInputs.length;
    let filledFields = 0;

    formInputs.forEach(input => {
        if (input.value && input.value !== '') {
            filledFields++;
        }
    });

    const percentage = Math.round((filledFields / totalFields) * 100);
    progressBar.style.width = percentage + '%';
    progressText.textContent = percentage + '% Complete';
}

// Add event listeners to all form inputs
document.addEventListener('DOMContentLoaded', () => {
    const formInputs = form.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('change', updateProgress);
        input.addEventListener('input', updateProgress);
    });

    // Initialize progress
    updateProgress();
});

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Analyzing...</span>';

    try {
        // Collect form data
        const formData = new FormData(form);
        const patientData = {};

        for (let [key, value] of formData.entries()) {
            patientData[key] = parseFloat(value);
        }

        console.log('Submitting patient data:', patientData);

        // Call the prediction API
        const predictResponse = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patientData)
        });

        if (!predictResponse.ok) {
            throw new Error('Failed to get prediction');
        }

        const predictData = await predictResponse.json();
        console.log('Prediction response:', predictData);

        // Get live vitals
        const vitalsResponse = await fetch(`${API_BASE_URL}/wearable/stream?patient_id=${patientId}`);
        const vitalsData = await vitalsResponse.json();
        console.log('Vitals response:', vitalsData);

        // Get fusion analysis
        const fusionResponse = await fetch(`${API_BASE_URL}/aura/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patientData)
        });

        const fusionData = await fusionResponse.json();
        console.log('Fusion response:', fusionData);

        // Display results
        displayResults(predictData, vitalsData, fusionData, patientData);

    } catch (error) {
        console.error('Error:', error);
        alert('Error analyzing health data. Please make sure the API server is running on http://localhost:8000');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <span>Analyze My Health</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }
});

// Display results in the panel
function displayResults(predictData, vitalsData, fusionData, patientData) {
    // Show results panel
    resultsPanel.classList.add('show');

    // Display risk score
    const riskScore = Math.round(predictData.risk_score * 100);
    document.getElementById('riskScore').textContent = riskScore + '%';
    document.getElementById('riskFill').style.width = riskScore + '%';

    // Set risk label
    const riskLabel = document.getElementById('riskLabel');
    if (riskScore < 30) {
        riskLabel.textContent = 'Low Risk';
        riskLabel.className = 'risk-label low';
    } else if (riskScore < 60) {
        riskLabel.textContent = 'Moderate Risk';
        riskLabel.className = 'risk-label moderate';
    } else {
        riskLabel.textContent = 'High Risk';
        riskLabel.className = 'risk-label high';
    }

    // Display status
    document.getElementById('statusText').textContent = predictData.status;

    // Display vitals
    document.getElementById('vitalsText').textContent = vitalsData.bpm + ' BPM';

    // Display fusion analysis
    document.getElementById('fusionText').textContent = fusionData.fusion_status;

    // Generate recommendations
    generateRecommendations(predictData, patientData);
}

// Generate personalized recommendations
function generateRecommendations(predictData, patientData) {
    const recommendations = [];

    // Risk-based recommendations
    if (predictData.risk_score > 0.6) {
        recommendations.push('Schedule an appointment with a healthcare provider for a comprehensive evaluation.');
        recommendations.push('Consider getting additional screening tests for chronic diseases.');
    }

    // Lifestyle recommendations
    if (patientData.Smoker === 1) {
        recommendations.push('Consider a smoking cessation program to reduce your health risks.');
    }

    if (patientData.PhysActivity === 0) {
        recommendations.push('Engage in at least 150 minutes of moderate physical activity per week.');
    }

    if (patientData.BMI > 30) {
        recommendations.push('Work with a nutritionist to develop a healthy weight management plan.');
    } else if (patientData.BMI > 25) {
        recommendations.push('Maintain a balanced diet and regular exercise to manage your weight.');
    }

    if (patientData.HighBP === 1) {
        recommendations.push('Monitor your blood pressure regularly and follow your doctor\'s treatment plan.');
    }

    if (patientData.HighChol === 1) {
        recommendations.push('Follow a heart-healthy diet low in saturated fats and cholesterol.');
    }

    if (patientData.Fruits === 0 || patientData.Veggies === 0) {
        recommendations.push('Increase your daily intake of fruits and vegetables to at least 5 servings per day.');
    }

    if (patientData.HvyAlcoholConsump === 1) {
        recommendations.push('Reduce alcohol consumption to moderate levels or consider abstaining.');
    }

    if (patientData.MentHlth > 7) {
        recommendations.push('Consider speaking with a mental health professional for support.');
    }

    // General recommendations
    recommendations.push('Get regular health screenings as recommended for your age group.');
    recommendations.push('Maintain consistent sleep patterns of 7-9 hours per night.');

    // Update recommendations list
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
}

// Refresh vitals data
async function refreshVitals() {
    try {
        const vitalsResponse = await fetch(`${API_BASE_URL}/wearable/stream?patient_id=${patientId}`);
        const vitalsData = await vitalsResponse.json();

        document.getElementById('vitalsText').textContent = vitalsData.bpm + ' BPM';

        // Add a visual pulse effect
        const vitalsText = document.getElementById('vitalsText');
        vitalsText.style.animation = 'none';
        setTimeout(() => {
            vitalsText.style.animation = 'pulse-scale 1.5s ease-in-out infinite';
        }, 10);

    } catch (error) {
        console.error('Error refreshing vitals:', error);
    }
}

// Close results panel
function closeResults() {
    resultsPanel.classList.remove('show');
}

// Reset form
function resetForm() {
    form.reset();
    closeResults();
    updateProgress();

    // Generate new patient ID
    patientId = 'patient_' + Date.now();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Auto-refresh vitals every 5 seconds when results are shown
setInterval(() => {
    if (resultsPanel.classList.contains('show')) {
        refreshVitals();
    }
}, 5000);
