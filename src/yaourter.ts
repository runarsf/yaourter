import * as path from 'path';
import * as fs from 'fs';
const NodeCache = require('node-cache');
const {Client, Intents} = require('discord.js');
import {/*ClientOptions,*/ Collection} from 'discord.js';
import {Logger} from '@utils/logger';

/**
 * @todo Should intents be separated into its own interface?
 * @todo Add markdown formatting: https://discordjs.guide/popular-topics/builders.html#formatters
 */
interface Config {
  token?: string;
  intents?: typeof Intents
}

const DefaultConfig: Config = {
  intents: [Intents.FLAGS.GUILDS]
}

export class Yaourter extends Client {
  constructor(config: Config) {
    super({...DefaultConfig, ...config});
    //this.config = {...DefaultConfig, ...config};
  }

  public async start(): Promise<string> {
    await this.init();

    return this.login(super.token);
  }

  public async init(): Promise<void> {
    Logger.debug('Initializing')

    this.commands = new Collection();
    this.loadAllCommands();

    this.cache = new NodeCache({stdTTL: 1800, checkperiod: 600});

    this.loadEvents();
  }

  /**
   * Establish a connection to Discord.
   * @param {string} token The account token
   * @returns {Promise<string>} The token used to connect to Discord, same as `token`
   */
  private login(token: string): Promise<string> {
    Logger.debug('Logging in')
    return super.login(token);
  }

  private loadEvents(): void {
    Logger.debug('Loading events')
    const _eventFiles = fs.readdirSync(path.resolve(__dirname, 'events')).filter(file => file.endsWith('.js'));

    for (const _file of _eventFiles) {
      const _eventPath = path.resolve(__dirname, 'events', _file);
      const _event = require(_eventPath);
      if (_event.once) {
        Logger.debug(`Loading event once: ${_eventPath}`)
        super.once(_event.name, (...args: any) => _event.execute(...args));
      } else {
        Logger.debug(`Loading event dynamically: ${_eventPath}`)
        super.on(_event.name, (...args: any) => _event.execute(...args));
      }
    }
  }

  /**
   * @todo Turn into `loadModule` and allow loading both commands and events.
   * @param {string} command 
   * @param {string} category 
   */
  private loadCommand(command: string, category: string | undefined = undefined): void {
    const _commandPath = category === undefined
      ? path.resolve(__dirname, 'commands', command)
      : path.resolve(__dirname, 'commands', category, command);
    Logger.debug(`Loading command ${_commandPath}`);
    const _command = require(_commandPath);
    this.commands.set(_command.data.name, _command);
  }

  private loadAllCommands(): void {
    fs.readdirSync(path.resolve(__dirname, 'commands'), {withFileTypes: true}).forEach(commandOrCategoryDirent => {
      if (commandOrCategoryDirent.isDirectory()) {
        fs.readdirSync(path.resolve(__dirname, 'commands', commandOrCategoryDirent.name), {withFileTypes: true})
          .filter(dirent => dirent.isFile())
          .filter(dirent => dirent.name.endsWith('.js'))
          .forEach(commandDirent => {
            this.loadCommand(commandDirent.name, commandOrCategoryDirent.name);
          });
      } else if (commandOrCategoryDirent.isFile() && commandOrCategoryDirent.name.endsWith('.js')) {
        this.loadCommand(commandOrCategoryDirent.name);
      }
    });
  }
}
