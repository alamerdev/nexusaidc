// Login functionality
class LoginManager {
    constructor() {
        this.loginBtn = document.getElementById('loginBtn');
        this.setupEventListeners();
        this.checkExistingToken();
    }

    setupEventListeners() {
        this.loginBtn.addEventListener('click', () => this.initiateLogin());
    }

    initiateLogin() {
        log('Initiating Discord OAuth login');
        window.location.href = `${CONFIG.WORKER_URL}/api/auth/discord/login`;
    }

    checkExistingToken() {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('access_token');
        
        if (token) {
            log('Token found in URL, redirecting to dashboard');
            localStorage.setItem('nexus_access_token', token);
            // Clean URL
            window.history.replaceState({}, document.title, 'dashboard.html');
            window.location.href = 'dashboard.html';
        }
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LoginManager();
    });
} else {
    new LoginManager();
}