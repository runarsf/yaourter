const {MessageEmbed} = require('discord.js');
import {SlashCommandBuilder} from '@discordjs/builders';
import {Logger} from '@utils/logger';
const translate = require('@vitalets/google-translate-api');

// Splitting message into chunks: https://github.com/vitalets/google-translate-api/issues/20

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate a string')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The string to translate')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('to')
        .setDescription('The target language')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('from')
        .setDescription('The source language')
        .setRequired(false)),
  async execute(interaction: any) {
    const messageOption: string = interaction.options.getString('message');
    const toOption: string = translate.languages.getCode(interaction.options.getString('to') ?? 'en');
    const fromOption: string = translate.languages.getCode(interaction.options.getString('from') ?? 'auto');
    if (!toOption) {Logger.info(`Invalid language code: ${interaction.options.getString('to')}`); return;}
    if (!fromOption) {Logger.info(`Invalid language code: ${interaction.options.getString('from')}`); return;}

    await interaction.deferReply();

    //  .setAuthor(userData.name, userData.image[0]['#text'], userData.url)
    //await interaction.reply({embeds:[_embed]});

    translate(messageOption, {to: toOption, from: fromOption}).then((res: any) => {
      let _embed: typeof MessageEmbed = new MessageEmbed()
        .setColor('#2F3136')
        .addFields(
          {name: `From: ${translate.languages.getCode(res.from.language.iso)}\nTo: ${translate.languages.getCode(toOption)}`, value: res.text, inline: false},
        )
      if (res.from.language.didYouMean) {_embed = _embed.addFields({name: 'Did you mean to translate from', value: translate.languages.getCode(res.from.language.iso), inline: true});}
      if (res.from.text.didYouMean) {_embed = _embed.addFields({name: 'Did you mean to write', value: res.from.text.value, inline: true});}
      interaction.editReply({embeds: [_embed]});
    }).catch((err: any) => {
      Logger.error(err);
    });
  },
};
