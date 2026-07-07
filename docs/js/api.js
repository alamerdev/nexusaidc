// API Manager
class APIManager {
    constructor() {
        this.token = localStorage.getItem('nexus_access_token');
        this.baseUrl = CONFIG.WORKER_URL;
        
        if (!this.token) {
            this.redirectToLogin();
        }
    }

    redirectToLogin() {
        log('No token found, redirecting to login');
        window.location.href = 'login.html';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            ...options.headers
        };

        const config = {
            method: options.method || 'GET',
            headers,
            ...options
        };

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            log(`API Request: ${config.method} ${url}`);
            const response = await fetch(url, config);
            
            if (response.status === 401) {
                err('Unauthorized - Token expired');
                this.redirectToLogin();
                return null;
            }

            const data = await response.json();
            
            if (!response.ok) {
                err(`API Error: ${response.status}`, data);
                return null;
            }

            log(`API Response: ${endpoint}`, data);
            return data;
        } catch (error) {
            err(`API Request Failed: ${endpoint}`, error);
            return null;
        }
    }

    // Auth
    async getUser() {
        return this.request('/api/auth/discord/user');
    }

    // Servers
    async getServers() {
        return this.request('/api/server/list');
    }

    async getServerSettings(serverId) {
        return this.request(`/api/server/settings?id=${serverId}`);
    }

    async updateServerSettings(serverId, settings) {
        return this.request(`/api/server/settings/update`, {
            method: 'POST',
            body: {
                server_id: serverId,
                ...settings
            }
        });
    }
}

const api = new APIManager();