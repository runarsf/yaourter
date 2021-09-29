import {Logger} from '@utils/logger';
import {BotCommand} from '../interfaces/botCommand';

module.exports = {
  name: 'interactionCreate',
  async execute(interaction): Promise<void> {
    Logger.debug(`${interaction.user.tag} in >${interaction.guild.name} in #${interaction.channel.name} triggered an interaction.`);

    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName) as BotCommand;

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      Logger.error(error);
      await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
    }
  },
};