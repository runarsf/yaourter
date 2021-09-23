import * as dotenv from 'dotenv';
dotenv.config();

/**
 * @todo Allow using a config.json file as well, but make ENV override (const { token } = require('./config.json))
 */

export const DISCORD_TOKEN: string = process.env.DISCORD_TOKEN;

export const CLIENT_ID: string = process.env.CLIENT_ID;

export const DEV_GUILD_IDS: string[] = process.env.DEV_GUILD_IDS.split(',');
