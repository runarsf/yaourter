import 'module-alias/register';
import * as fs from 'fs';
import * as path from 'path';
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
import { DISCORD_TOKEN, CLIENT_ID, DEV_GUILD_IDS } from './config';
import { Logger } from '@utils/logger';

const commands = [];
const commandFiles: string[] = [];
//const commandFiles = fs.readdirSync(path.resolve(__dirname, 'commands')).filter(file => file.endsWith('.js'));

fs.readdirSync(path.resolve(__dirname, 'commands'), {withFileTypes: true}).forEach(commandOrCategoryDirent => {
  if (commandOrCategoryDirent.isDirectory()) {
    fs.readdirSync(path.resolve(__dirname, 'commands', commandOrCategoryDirent.name), {withFileTypes: true})
      .filter(dirent => dirent.isFile())
      .filter(dirent => dirent.name.endsWith('.js'))
      .forEach(commandDirent => {
        commandFiles.push(path.resolve(__dirname, 'commands', commandOrCategoryDirent.name, commandDirent.name));
      });
  } else if (commandOrCategoryDirent.isFile() && commandOrCategoryDirent.name.endsWith('.js')) {
    commandFiles.push(path.resolve(__dirname, 'commands', commandOrCategoryDirent.name));
  }
});

for (const commandFile of commandFiles) {
  const command = require(path.resolve(__dirname, 'commands', commandFile));
  Logger.debug(`Found command: ${commandFile}`)
  // Logger.debug(command.data.toJSON());
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

/**
 * @todo Add option for application commands, but don't loop through guilds in that case.
 *  - Export guild membership to a config that can be sourced by this script.
 */
// @ts-ignore TODO
for (const devGuildId of DEV_GUILD_IDS) {
  (async () => {
    try {
      Logger.log(`Started refreshing dev guild (/) commands for guild ${devGuildId}.`);

      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, devGuildId),
        { body: commands },
        );

        Logger.log(`Successfully reloaded dev guild (/) commands for guild ${devGuildId}.`);
      } catch (error) {
        Logger.error(String(error));
      }
    })();
}
