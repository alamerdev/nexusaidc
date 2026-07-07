const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Zeige alle NexusAI Befehle'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🤖 NexusAI Hilfe')
      .setDescription('Alle verfügbaren Befehle')
      .addFields(
        { name: '/ask', value: 'Stelle NexusAI eine Frage', inline: true },
        { name: '/script', value: 'Generiere Code', inline: true },
        { name: '/set_language', value: 'Stelle die Sprache ein', inline: true },
        { name: '/set_personality', value: 'Passe die Persönlichkeit an', inline: true },
        { name: '/help', value: 'Zeige diese Hilfe', inline: true }
      )
      .setFooter({ text: 'Made by alamerdev' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
