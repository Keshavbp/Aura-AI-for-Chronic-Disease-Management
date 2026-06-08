const API_BASE_URL = window.location.protocol.startsWith('http')
    ? window.location.origin
    : 'http://localhost:8000';

let currentMode = 'login';

function switchTab(mode) {
    currentMode = mode;
    document.getElementById('tab-login').classList.toggle('active', mode === 'login');
    document.getElementById('tab-register').classList.toggle('active', mode === 'register');
    document.getElementById('submit-btn').textContent = mode === 'login' ? 'Login' : 'Register';
    document.getElementById('auth-error').textContent = '';
}

async function handleAuth(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('auth-error');
    
    errorDiv.textContent = '';
    
    try {
        if (currentMode === 'register') {
            // Register flow
            const regRes = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    is_active: true,
                    is_superuser: false,
                    is_verified: false
                })
            });
            
            if (!regRes.ok) {
                const contentType = regRes.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await regRes.json();
                    throw new Error(data.detail || 'Registration failed');
                } else {
                    const text = await regRes.text();
                    throw new Error(`Server Error: ${regRes.status} ${regRes.statusText}. Please check the server terminal logs.`);
                }
            }
            // Automatically switch to login to get the token
            currentMode = 'login';
        }
        
        // Login flow
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        const loginRes = await fetch(`${API_BASE_URL}/auth/jwt/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        
        if (!loginRes.ok) {
            const contentType = loginRes.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await loginRes.json();
                throw new Error(data.detail || 'Login failed');
            } else {
                const text = await loginRes.text();
                throw new Error(`Server Error: ${loginRes.status} ${loginRes.statusText}. Please check the server terminal logs.`);
            }
        }
        
        const data = await loginRes.json();
        // Save the JWT token
        localStorage.setItem('aura_token', data.access_token);
        
        // Redirect to admin page
        window.location.href = 'admin.html';
        
    } catch (err) {
        errorDiv.textContent = err.message;
    }
}
