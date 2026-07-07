const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { saveServerConfig, getServerConfig } = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set_language')
    .setDescription('Stelle die Bot-Sprache ein')
    .addStringOption(option =>
      option.setName('sprache')
        .setDescription('Sprache')
        .setRequired(true)
        .addChoices(
          { name: 'Deutsch', value: 'de' },
          { name: 'English', value: 'en' },
          { name: 'Français', value: 'fr' }
        )
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      // Check if user is admin
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return await interaction.editReply('❌ Du brauchst Administrator-Rechte!');
      }

      const language = interaction.options.getString('sprache');
      const config = await getServerConfig(interaction.guildId);
      config.language = language;

      await saveServerConfig(interaction.guildId, config);

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('✅ Sprache aktualisiert')
        .setDescription(`Sprache: ${language === 'de' ? 'Deutsch' : language === 'en' ? 'English' : 'Français'}`);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Set language error:', error);
      await interaction.editReply('❌ Fehler beim Speichern!');
    }
  },
};
