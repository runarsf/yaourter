import * as dotenv from 'dotenv';
dotenv.config();

/**
 * @todo Allow using a config.json file as well, but make ENV override (const { token } = require('./config.json))
 */

export const DISCORD_TOKEN: string | undefined = process.env.DISCORD_TOKEN;

export const CLIENT_ID: string | undefined = process.env.CLIENT_ID;

export const DEV_GUILD_IDS: string[] | undefined = process.env.DEV_GUILD_IDS?.split(',');

export const LOG_LEVEL: string | undefined = process.env.LOG_LEVEL || 'DEBUG';

export const STEAM_API_KEY: string | undefined = process.env.STEAM_API_KEY;

export const LASTFM_API_KEY: string | undefined = process.env.LASTFM_API_KEY;
