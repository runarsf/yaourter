import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Show information about user.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('user')
        .setDescription('Info about a user')
        .addUserOption(option => option.setName('target').setDescription('The user')))
    .addSubcommand(subcommand =>
      subcommand
        .setName('server')
        .setDescription('Info about the server')),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'user') {
      const user = interaction.options.getUser('target') || interaction.user;
      await interaction.reply(`Tag: ${user.tag}\nID: ${user.id}`);
    } else if (interaction.options.getSubcommand() === 'server') {
      await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
    }
  },
};
