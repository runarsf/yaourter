const {MessageEmbed} = require('discord.js');
import {SlashCommandBuilder} from '@discordjs/builders';
import {Logger} from '@utils/logger';
import {STEAM_API_KEY} from '../config';
import axios from 'axios';
import * as stringSimilarity from 'string-similarity';

/**
 * @todo Search for protondb id.
 * https://protondb.max-p.me/
 * https://steamcommunity.com/dev/apikey
 */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('protondb')
    .setDescription('Get ProtonDB reports.')
    .addStringOption(option =>
      option.setName('game')
        .setDescription('The game name')
        .setRequired(true)),
  async execute(interaction): Promise<void> {
    const gameName: string = interaction.options.getString('game');
    const steamApiKeyParam: string = STEAM_API_KEY ? `&key=${STEAM_API_KEY}` : '';

    await interaction.deferReply({ ephemeral: false });

    let protonCache: any = interaction.client.cache.get('protondb');
    if (protonCache === undefined) {
      await interaction.editReply('First time fetching ProtonDB api, this might take a while...');
      Logger.debug('Fetching ProtonDB api');
      protonCache = await axios.get('https://protondb.max-p.me/games')
        .then(res => res.data)
        .catch(err => { return Logger.warning(`Failed to fetch ProtonDB data.\n${err}`) });
      Logger.debug('Finished fetching ProtonDB api');
      Logger.debug('Caching ProtonDB api-response');
      interaction.client.cache.set('protondb', protonCache, 10800);
      Logger.debug('Finished caching ProtonDB api-response');
    }

    let games: string[] = protonCache.map(obj => obj.title);
    const bestMatchGameIndex: number = stringSimilarity.findBestMatch(gameName.toLowerCase(), games.map(obj => obj.toLowerCase())).bestMatchIndex;

    const protonCacheGameId: string = protonCache[bestMatchGameIndex].appId;
    const protonCacheGameName: string = protonCache[bestMatchGameIndex].title;

    try {
      // Always returns a valid json object, even if 404.
      const steamRes = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${protonCacheGameId}&cc=us${steamApiKeyParam}`)
        .then(res => res.data[protonCacheGameId]);

      const protonDbRes = await axios.get(`https://www.protondb.com/api/v1/reports/summaries/${protonCacheGameId}.json`)
        .then(res => res.data)
        .catch(err => Logger.warning(`Failed to look up game ${protonCacheGameId} (${protonCacheGameName}) on ProtonDB.\n${err}`));

      let _embed: typeof MessageEmbed = new MessageEmbed()
        .setTitle(protonCacheGameName)
        .setURL(`https://www.protondb.com/app/${protonCacheGameId}`)
        .setDescription(`[Submit a ProtonDB report](https://www.protondb.com/contribute?appId=${protonCacheGameId}).`)
        .setColor('#2F3136')
        .setFooter(`App ID: ${protonCacheGameId}`)

      if (protonDbRes) {
        _embed = _embed
        .addFields(
          {name: 'ProtonDB Rating\nOverall', value: `${protonDbRes.tier} (${protonDbRes.total} reports)`, inline: true},
          {name: '\u200b\nRecent', value: protonDbRes.trendingTier, inline: true},
          {name: '\u200b\nHighest', value: protonDbRes.bestReportedTier, inline: true}
        )
      }

      if (steamRes.success) {
        let gameSteamDescription = steamRes.data.short_description
          ?? steamRes.data.detailed_description
          ?? steamRes.data.about_the_game
          ?? ''
          .replace(/<[^>]*>?/gm, '');
        if (gameSteamDescription.length > 303) gameSteamDescription = gameSteamDescription.substring(0, 300) + '...';

        const gameSteamPrice: string = steamRes.data.price_overview ? `> Price: ${steamRes.data.price_overview.final_formatted} (-${steamRes.data.price_overview.discount_percent}%)\n` : '';
        _embed = _embed
          .setDescription(gameSteamDescription + `\n\n${gameSteamPrice}> [ProtonDB](https://www.protondb.com/app/${protonCacheGameId}) [[Submit a report](https://www.protondb.com/contribute?appId=${protonCacheGameId})]\n\u200b`)
          .setURL(`https://store.steampowered.com/app/${protonCacheGameId}`)
          .setImage(steamRes.data.header_image)
      }
      await interaction.editReply({embeds: [_embed]});
    } catch (error) {
      Logger.error(error);
    }
  },
};
