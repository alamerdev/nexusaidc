const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getGroqResponse } = require('../utils/groq');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('script')
    .setDescription('Generiere Code mit NexusAI')
    .addStringOption(option =>
      option.setName('sprache')
        .setDescription('Programmiersprache')
        .setRequired(true)
        .addChoices(
          { name: 'JavaScript', value: 'javascript' },
          { name: 'Python', value: 'python' },
          { name: 'Roblox Lua', value: 'lua' },
          { name: 'Java', value: 'java' }
        )
    )
    .addStringOption(option =>
      option.setName('beschreibung')
        .setDescription('Was soll der Code machen?')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const language = interaction.options.getString('sprache');
      const description = interaction.options.getString('beschreibung');

      const prompt = `Generiere einen ${language} Code für: ${description}\n\nNur den Code, keine Erklärung.`;
      const personality = 'Du bist ein Experte in Code-Generierung. Generiere sauberen, gut strukturierten Code.';

      const code = await getGroqResponse(personality, prompt);

      // Format as code block
      const formattedCode = code.length > 1900 
        ? code.slice(0, 1900) + '...'
        : code;

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle(`💻 ${language} Code generiert`)
        .setDescription(`\`\`\`${language}\n${formattedCode}\n\`\`\``)
        .setFooter({ text: 'Powered by Groq' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Script command error:', error);
      await interaction.editReply('❌ Fehler bei der Code-Generierung!');
    }
  },
};
