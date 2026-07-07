const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set_personality')
    .setDescription('Passe die KI-Persönlichkeit an'),

  async execute(interaction) {
    // Check if user is admin
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return await interaction.reply({
        content: '❌ Du brauchst Administrator-Rechte!',
        ephemeral: true,
      });
    }

    const modal = new ModalBuilder()
      .setCustomId('personality_modal')
      .setTitle('NexusAI Persönlichkeit');

    const input = new TextInputBuilder()
      .setCustomId('personality_input')
      .setLabel('Persönlichkeit beschreiben')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('z.B. Du bist ein freundlicher und hilfreicher KI-Assistent...')
      .setRequired(true);

    modal.addComponents(new (require('discord.js')).ActionRowBuilder().addComponents(input));
    await interaction.showModal(modal);
  },
};
