// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// Navigation
document.addEventListener('DOMContentLoaded', () => {
    // Section navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // Add active class to clicked item
            item.classList.add('active');

            // Show corresponding section
            const sectionId = item.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Load dashboard data on page load
    loadDashboardData();
});

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Check API status
        const response = await fetch(`${API_BASE_URL}/`);
        const data = await response.json();

        console.log('API Status:', data);

        // You can add more API calls here to fetch real data
        // For now, we're using simulated data

    } catch (error) {
        console.error('Error connecting to API:', error);
        // Display a notification that API is offline
        showNotification('API server is offline. Using cached data.', 'warning');
    }
}

// Refresh Dashboard
function refreshDashboard() {
    // Show loading state
    const refreshBtn = event.target.closest('button');
    const originalContent = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<span>🔄 Refreshing...</span>';
    refreshBtn.disabled = true;

    // Simulate data refresh
    setTimeout(() => {
        // Update stats with random variations
        updateStats();

        refreshBtn.innerHTML = originalContent;
        refreshBtn.disabled = false;
        showNotification('Dashboard refreshed successfully', 'success');
    }, 1500);
}

// Update Statistics
function updateStats() {
    // Simulate stats update with small random changes
    const totalAssessments = document.getElementById('totalAssessments');
    const highRiskPatients = document.getElementById('highRiskPatients');
    const lowRiskPatients = document.getElementById('lowRiskPatients');
    const avgRiskScore = document.getElementById('avgRiskScore');

    // Update with new random values
    const currentTotal = parseInt(totalAssessments.textContent.replace(',', ''));
    totalAssessments.textContent = (currentTotal + Math.floor(Math.random() * 10)).toLocaleString();

    const currentHigh = parseInt(highRiskPatients.textContent);
    highRiskPatients.textContent = currentHigh + Math.floor(Math.random() * 5);

    const currentLow = parseInt(lowRiskPatients.textContent);
    lowRiskPatients.textContent = currentLow + Math.floor(Math.random() * 10);

    const currentAvg = parseFloat(avgRiskScore.textContent);
    avgRiskScore.textContent = (currentAvg + (Math.random() * 0.1 - 0.05)).toFixed(2);
}

// Show Notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(67, 233, 123, 0.2)' : type === 'warning' ? 'rgba(250, 112, 154, 0.2)' : 'rgba(102, 126, 234, 0.2)'};
        border: 1px solid ${type === 'success' ? '#43e97b' : type === 'warning' ? '#fa709a' : '#667eea'};
        color: #fff;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Patient Table - View Details
function viewPatientDetails(patientId) {
    showNotification(`Opening details for ${patientId}`, 'info');
    // In a real application, this would open a modal or navigate to a detail page
}

// Patient Table - Download Report
function downloadReport(patientId) {
    showNotification(`Downloading report for ${patientId}`, 'success');
    // In a real application, this would trigger a PDF download
}

// Add event listeners to table action buttons
document.addEventListener('DOMContentLoaded', () => {
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const row = btn.closest('tr');
            const patientId = row.querySelector('td:first-child').textContent;

            if (index % 2 === 0) {
                viewPatientDetails(patientId);
            } else {
                downloadReport(patientId);
            }
        });
    });
});

// Simulated real-time updates
setInterval(() => {
    // Add new activity item occasionally
    if (Math.random() > 0.7) {
        addNewActivity();
    }
}, 10000); // Every 10 seconds

function addNewActivity() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;

    const activities = [
        { icon: '📊', text: 'New assessment completed', risk: false },
        { icon: '💓', text: 'Vital signs normal range', risk: false },
        { icon: '⚠️', text: 'High-risk patient detected', risk: true },
        { icon: '📈', text: 'Model accuracy updated', risk: false }
    ];

    const activity = activities[Math.floor(Math.random() * activities.length)];

    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.style.animation = 'fadeIn 0.5s ease';
    activityItem.innerHTML = `
        <div class="activity-icon ${activity.risk ? 'high-risk' : ''}">${activity.icon}</div>
        <div class="activity-content">
            <p class="activity-text">${activity.text}</p>
            <span class="activity-time">Just now</span>
        </div>
    `;

    // Insert at the beginning
    activityList.insertBefore(activityItem, activityList.firstChild);

    // Remove last item if more than 5
    if (activityList.children.length > 5) {
        activityList.removeChild(activityList.lastChild);
    }
}

// Chart filters
document.addEventListener('DOMContentLoaded', () => {
    const chartFilters = document.querySelectorAll('.chart-filter');
    chartFilters.forEach(filter => {
        filter.addEventListener('change', (e) => {
            showNotification(`Updating chart for ${e.target.value}`, 'info');
            // In a real application, this would update the chart data
        });
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Settings - Save Changes
document.addEventListener('DOMContentLoaded', () => {
    const saveButtons = document.querySelectorAll('.settings-card .btn-primary');
    saveButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Settings saved successfully', 'success');
        });
    });

    // Data Management Actions
    const actionButtons = document.querySelectorAll('.setting-actions .btn-secondary');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.textContent.trim();
            if (action.includes('Reset')) {
                if (confirm('Are you sure you want to reset the system? This action cannot be undone.')) {
                    showNotification('System reset initiated...', 'warning');
                }
            } else {
                showNotification(`Action: ${action}`, 'info');
            }
        });
    });
});

// API Status Check
async function checkAPIStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/`);
        const data = await response.json();
        return true;
    } catch (error) {
        return false;
    }
}

// Periodic API health check
setInterval(async () => {
    const isOnline = await checkAPIStatus();
    const statusIndicator = document.querySelector('.api-status');

    if (statusIndicator) {
        statusIndicator.textContent = isOnline ? '🟢 API Online' : '🔴 API Offline';
        statusIndicator.style.color = isOnline ? '#43e97b' : '#f5576c';
    }
}, 30000); // Every 30 seconds
