import { SlashCommandBuilder } from '@discordjs/builders';
import { Logger } from '@utils/logger';
import axios from 'axios';

// https://github.com/discordjs/builders/blob/main/docs/examples/Slash%20Command%20Builders.md

/**
 * @todo Fetch list of tags from floof api and provide as command options.
 */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('floof')
    .setDescription('Get a random floof from https://floof.runarsf.dev.')
    .addStringOption(option =>
      option.setName('tag')
        .setDescription('The floof tag.')
        .setRequired(false)
        .addChoice('Fox', 'fox')
        .addChoice('Dog', 'dog')),
  async execute(interaction) {
    const tag = interaction.options.getString('tag') ? `&tag=${interaction.options.getString('tag')}` : '';

    try {
      const res = await axios.get(`https://floof.runarsf.dev/api/random?type=json${tag}`);
      await interaction.reply(res.data.url);
    } catch (error) {
      Logger.error(error);
    }
  },
};
