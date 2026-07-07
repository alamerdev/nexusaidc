const axios = require('axios');

const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8787';

async function getServerConfig(serverId) {
  try {
    const response = await axios.get(`${WORKER_URL}/api/settings/${serverId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.WORKER_AUTH_TOKEN}`,
      },
    });
    return response.data || getDefaultConfig();
  } catch (error) {
    console.error('Error fetching config:', error.message);
    return getDefaultConfig();
  }
}

async function saveServerConfig(serverId, config) {
  try {
    await axios.post(`${WORKER_URL}/api/settings/${serverId}`, config, {
      headers: {
        'Authorization': `Bearer ${process.env.WORKER_AUTH_TOKEN}`,
      },
    });
    return true;
  } catch (error) {
    console.error('Error saving config:', error.message);
    return false;
  }
}

function getDefaultConfig() {
  return {
    language: 'de',
    aiChannel: null,
    personality: 'Du bist NexusAI, ein freundlicher und hilfsbereiter KI-Assistent.',
    autoReply: false,
    admins: [],
  };
}

module.exports = {
  getServerConfig,
  saveServerConfig,
  getDefaultConfig,
};
