import * as fs from 'fs';
import * as path from 'path';
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
import { DISCORD_TOKEN, CLIENT_ID } from './config';
import { Logger } from './utils/logger';

const commands = [];
const commandFiles = fs.readdirSync(path.resolve(__dirname, './commands')).filter(file => file.endsWith('.js'));

for (const commandFile of commandFiles) {
  const command = require(path.resolve(__dirname, 'commands', commandFile));
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    Logger.log('Started refreshing application (/) commands.');
    
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands },
      );
      
      Logger.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      Logger.error(error);
    }
  })();
