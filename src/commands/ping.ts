import {SlashCommandBuilder} from '@discordjs/builders';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    const _sent = await interaction.reply({content: 'Pong!', fetchReply: true});
    interaction.editReply(`Pong!\nRoundtrip latency: \`${_sent.createdTimestamp - interaction.createdTimestamp}ms\``);
    //await interaction.reply({
    //  //content: `Pong!\nWebsocket heartbeat: ${client.ws.ping}ms\nRoundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`,
    //  content: 'Pong!',
    //  ephemeral: true
    //});

  },
};
