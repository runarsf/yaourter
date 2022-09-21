const {MessageEmbed} = require('discord.js');
import {SlashCommandBuilder} from '@discordjs/builders';
import {Logger} from '@utils/logger';
import axios from 'axios';
import {LASTFM_API_KEY} from '../../config';

/**
 * @todo Manually rate limit with cache.
 */

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lastfm')
    .setDescription('Get music stats from last.fm')
    .addStringOption(option =>
      option.setName('user')
        .setDescription('The last.fm user')
        .setRequired(true)),
  async execute(interaction: any) {
    // @todo If LASTFM_API_KEY isn't provided, throw error to user and log warning.
    const userOption = interaction.options.getString('user');

    const trackData = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${userOption}&api_key=${LASTFM_API_KEY}&format=json`)
      .then(res => res.data.recenttracks)
      .catch(err => Logger.error(err));
    const userData = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${userOption}&api_key=${LASTFM_API_KEY}&format=json`)
      .then(res => res.data.user)
      .catch(err => Logger.error(err));

    let _embed: typeof MessageEmbed = new MessageEmbed()
      .setAuthor(userData.name, userData.image[0]['#text'], userData.url)
    await interaction.reply({embeds: [_embed]});
  },
};
