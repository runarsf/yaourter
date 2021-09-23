import 'module-alias/register';
import * as fs from 'fs';
import * as path from 'path';
const { Client, Collection, Intents } = require('discord.js');
import { DISCORD_TOKEN } from './config';
import { Logger } from '@utils/logger';

/**
 * @todo Migrate from commonjs to ESM.
 *  - node-fetch is incompatible with commonjs projects.
 *  - https://github.com/node-fetch/node-fetch/issues/1279#issuecomment-915062146
 */

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const eventFiles = fs.readdirSync(path.resolve(__dirname, 'events')).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(path.resolve(__dirname, 'events', file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.commands = new Collection();
const commandFiles: string[] = fs.readdirSync(path.resolve(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const commandFile of commandFiles) {
  const command = require(path.resolve(__dirname, 'commands', commandFile));
  client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  
  const command = client.commands.get(interaction.commandName);
  
  if (!command) return;
  
  try {
    await command.execute(interaction);
  } catch (error) {
    Logger.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(DISCORD_TOKEN);
