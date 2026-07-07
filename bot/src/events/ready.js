const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ Bot ready as ${client.user.tag}`);
    
    // Set bot status
    client.user.setActivity('NexusAI Dashboard', { type: ActivityType.Watching });
  },
};
