// Dashboard Manager
class DashboardManager {
    constructor() {
        this.currentServerID = null;
        this.currentSettings = null;
        this.init();
    }

    async init() {
        await this.loadUserData();
        this.setupEventListeners();
        await this.loadServers();
    }

    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.switchSection(e));
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('logoutBtn2').addEventListener('click', () => this.logout());

        // Back button
        document.getElementById('backBtn').addEventListener('click', () => this.goBack());

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e));
        });

        // Save buttons
        document.getElementById('savePersonalityBtn').addEventListener('click', () => this.savePersonality());
        document.getElementById('saveGroqBtn').addEventListener('click', () => this.saveGroq());
        document.getElementById('saveChatBtn').addEventListener('click', () => this.saveChat());
        document.getElementById('saveLanguageBtn').addEventListener('click', () => this.saveLanguage());

        // Language buttons
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectLanguage(e));
        });
    }

    async loadUserData() {
        const user = await api.getUser();
        
        if (user && user.user) {
            document.getElementById('userName').textContent = user.user.username;
            document.getElementById('userTag').textContent = `@${user.user.username}`;
            
            if (user.user.avatar) {
                document.getElementById('userAvatar').src = user.user.avatar;
            }
        }
    }

    async loadServers() {
        log('Loading servers...');
        document.getElementById('serversList').innerHTML = '<div class="loading">Lade Server...</div>';
        
        const response = await api.getServers();
        
        if (!response || !response.servers) {
            this.showToast('Fehler beim Laden der Server', 'error');
            return;
        }

        const servers = response.servers;
        log(`Loaded ${servers.length} servers`);

        if (servers.length === 0) {
            document.getElementById('serversList').innerHTML = '<div class="empty-state"><p>Du bist Administrator auf keinem Server mit NEXUS AI</p></div>';
            return;
        }

        const html = servers.map(server => `
            <div class="server-card" data-server-id="${server.id}">
                <div class="server-icon">
                    ${server.icon ? `<img src="${server.icon}" alt="${server.name}">` : '🖥️'}
                </div>
                <div class="server-info">
                    <h3>${server.name}</h3>
                    <p>${server.member_count || 0} Mitglieder</p>
                </div>
                <button class="btn btn-small" onclick="dashboard.openServer('${server.id}', '${server.name.replace(/'/g, "\\'")}')">Verwalten</button>
            </div>
        `).join('');

        document.getElementById('serversList').innerHTML = html;
    }

    async openServer(serverId, serverName) {
        log(`Opening server: ${serverId}`);
        this.currentServerID = serverId;

        // Show server details section
        document.getElementById('serversSection').style.display = 'none';
        document.getElementById('serverDetailsSection').style.display = 'block';

        // Update header
        document.getElementById('serverHeader').innerHTML = `
            <h1>${serverName}</h1>
            <p>Server ID: ${serverId}</p>
        `;

        // Load settings
        await this.loadServerSettings(serverId);
    }

    async loadServerSettings(serverId) {
        log(`Loading settings for server: ${serverId}`);
        
        const response = await api.getServerSettings(serverId);
        
        if (!response) {
            this.showToast('Fehler beim Laden der Einstellungen', 'error');
            return;
        }

        this.currentSettings = response.settings || {};
        log('Settings loaded:', this.currentSettings);

        // Populate form fields
        document.getElementById('personalityInput').value = this.currentSettings.personality || '';
        document.getElementById('groqKeyInput').value = this.currentSettings.groq_key ? '••••••••' : '';
        document.getElementById('modelSelect').value = this.currentSettings.model || 'mixtral-8x7b-32768';
        document.getElementById('chatChannelInput').value = this.currentSettings.chat_channel || '';
        document.getElementById('chatHistoryInput').value = this.currentSettings.chat_history_reset || 60;
        document.getElementById('autoReplyCheckbox').checked = this.currentSettings.auto_reply || false;
        
        // Set selected language
        const lang = this.currentSettings.language || 'de';
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.dataset.lang === lang) {
                btn.classList.add('selected');
            }
        });
    }

    async savePersonality() {
        const personality = document.getElementById('personalityInput').value;
        
        if (!personality.trim()) {
            this.showToast('Bitte gib eine Persönlichkeit ein', 'warning');
            return;
        }

        const result = await api.updateServerSettings(this.currentServerID, {
            personality: personality.trim()
        });

        if (result && result.success) {
            this.showToast('✅ Persönlichkeit gespeichert', 'success');
            this.currentSettings.personality = personality;
        } else {
            this.showToast('❌ Fehler beim Speichern', 'error');
        }
    }

    async saveGroq() {
        const key = document.getElementById('groqKeyInput').value;
        const model = document.getElementById('modelSelect').value;

        if (!key || key === '••••••••') {
            this.showToast('Bitte gib einen API Key ein', 'warning');
            return;
        }

        const result = await api.updateServerSettings(this.currentServerID, {
            groq_key: key,
            model: model
        });

        if (result && result.success) {
            this.showToast('✅ Groq-Einstellungen gespeichert', 'success');
            this.currentSettings.groq_key = key;
            this.currentSettings.model = model;
            document.getElementById('groqKeyInput').value = '••••••••';
        } else {
            this.showToast('❌ Fehler beim Speichern', 'error');
        }
    }

    async saveChat() {
        const channel = document.getElementById('chatChannelInput').value;
        const history = document.getElementById('chatHistoryInput').value;
        const autoReply = document.getElementById('autoReplyCheckbox').checked;

        const result = await api.updateServerSettings(this.currentServerID, {
            chat_channel: channel || null,
            chat_history_reset: parseInt(history),
            auto_reply: autoReply
        });

        if (result && result.success) {
            this.showToast('✅ Chat-Einstellungen gespeichert', 'success');
        } else {
            this.showToast('❌ Fehler beim Speichern', 'error');
        }
    }

    async saveLanguage() {
        const selected = document.querySelector('.language-btn.selected');
        
        if (!selected) {
            this.showToast('Bitte wähle eine Sprache', 'warning');
            return;
        }

        const lang = selected.dataset.lang;

        const result = await api.updateServerSettings(this.currentServerID, {
            language: lang
        });

        if (result && result.success) {
            this.showToast(`✅ Sprache auf ${selected.dataset.name} gesetzt`, 'success');
        } else {
            this.showToast('❌ Fehler beim Speichern', 'error');
        }
    }

    selectLanguage(e) {
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        e.target.closest('.language-btn').classList.add('selected');
    }

    switchTab(e) {
        const tabName = e.target.dataset.tab;
        
        // Remove active from all tabs and buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        
        // Add active to selected
        e.target.classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    switchSection(e) {
        e.preventDefault();
        const section = e.currentTarget.dataset.section;
        
        // Remove active from all nav items and sections
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
        
        // Add active to selected
        e.currentTarget.classList.add('active');
        document.getElementById(`${section}Section`).style.display = 'block';
        
        // Update title
        const titles = {
            servers: 'Übersicht',
            settings: 'Einstellungen'
        };
        document.getElementById('pageTitle').textContent = titles[section];
    }

    goBack() {
        document.getElementById('serversSection').style.display = 'block';
        document.getElementById('serverDetailsSection').style.display = 'none';
        document.querySelector('[data-section="servers"]').classList.add('active');
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast toast-${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    logout() {
        log('User logging out');
        localStorage.removeItem('nexus_access_token');
        window.location.href = 'login.html';
    }
}

// Initialize dashboard
let dashboard;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        dashboard = new DashboardManager();
    });
} else {
    dashboard = new DashboardManager();
}