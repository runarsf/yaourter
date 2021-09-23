import { SlashCommandBuilder } from '@discordjs/builders';
import { Logger } from '@utils/logger';
import axios from 'axios';

// https://github.com/discordjs/builders/blob/main/docs/examples/Slash%20Command%20Builders.md

/**
 * @todo Fetch list of albums from floof api and provide as command options.
 */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('floof')
    .setDescription('Get a random floof from https://floof.runarsf.dev.')
    .addStringOption(option =>
      option.setName('album')
        .setDescription('The floof album.')
        .setRequired(false)
        .addChoice('Fox', 'fox')
        .addChoice('Dog', 'dog')),
  async execute(interaction) {
    const album = interaction.options.getString('album') ? `&album=${interaction.options.getString('album')}` : '';

    try {
      const res = await axios.get(`https://floof.runarsf.dev/api/random?type=json${album}`);
      await interaction.reply(res.data.url);
    } catch (error) {
      Logger.error(error);
    }
  },
};
