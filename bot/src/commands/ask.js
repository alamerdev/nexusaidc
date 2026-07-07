const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getGroqResponse } = require('../utils/groq');
const { getServerConfig } = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Stelle NexusAI eine Frage!')
    .addStringOption(option =>
      option.setName('frage')
        .setDescription('Deine Frage an die KI')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const config = await getServerConfig(interaction.guildId);
      const personality = config.personality || 'Du bist ein freundlicher KI-Assistent.';
      const userQuestion = interaction.options.getString('frage');

      console.log(`[${interaction.guildId}] User asked: ${userQuestion}`);

      // Call Groq API
      const response = await getGroqResponse(personality, userQuestion);

      // Format response in embed
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🤖 NexusAI Antwort')
        .setDescription(response.slice(0, 4096))
        .setFooter({ text: 'Powered by Groq' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Ask command error:', error);
      await interaction.editReply('❌ Ein Fehler bei der KI-Anfrage ist aufgetreten!');
    }
  },
};
