const WORKER_URL = 'https://nexus.alamer.workers.dev';

class NexusAPI {
  constructor() {
    this.token = localStorage.getItem('discord_token');
    this.baseUrl = WORKER_URL;
  }

  async getServers() {
    try {
      const response = await fetch(`${this.baseUrl}/api/servers`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching servers:', error);
      return { servers: [] };
    }
  }

  async getSettings(serverId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/settings/${serverId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching settings:', error);
      return {};
    }
  }

  async saveSettings(serverId, settings) {
    try {
      const response = await fetch(`${this.baseUrl}/api/settings/${serverId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving settings:', error);
      return { error: error.message };
    }
  }
}

const api = new NexusAPI();
