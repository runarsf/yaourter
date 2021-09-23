import { Logger } from '@utils/logger';

module.exports = {
  name: 'interactionCreate',
  execute(interaction) {
    Logger.debug(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
  },
};