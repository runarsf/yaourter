import chalk from 'chalk';
import {format} from 'date-fns';
import {LOG_LEVEL} from '../config';

/**
 * The severity of a log-message is determined by the index in the LogLevel enumeration (starting at 0),
 * where a lower number indicates a lower severity, and a higher number is more severe.
 */
enum LogLevel {
  DEBUG,
  INFO,
  WARNING,
  ERROR
}

/**
 * The color that will be applied to the LogLevel-keyword.
 */
const LogColors = {
  DEBUG: chalk.green('%s'),
  INFO: chalk.blue('%s'),
  WARNING: chalk.yellow('%s'),
  ERROR: chalk.red('%s')
}

/**
 *
 */
function compareLogLevels() {
  return function (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const childFunction = descriptor.value;
    descriptor.value = (...args: any[]) => {
      /**
       * The default LogLevel `LogLevel.INFO` isn't passed to the decorator if no `logLevel`-parameter is passed to the child function.
       * In that case we should apply the default LogLevel that is set in `logLevel: LogLevel = LogLevel.INFO`.
       * @todo Figure out if the default LogLevel can be retrieved from the child-function by the decorator.
       */
      if (args[1] === undefined) args[1] = LogLevel.INFO;

      /**
       * If the LogLevel of the log-message is greater than, or equals to the wanted LogLevel `LOG_LEVEL`, continue, otherwise stop here.
       */
      // TODO Fix
      // @ts-ignore
      if (args[1] >= LogLevel[LOG_LEVEL]) {
        // TODO Fix
        // @ts-ignore
        return childFunction.apply(this, args);
      } else {
        return null;
      }
    };
    return descriptor;
  };
}

/**
 * @todo Fix newlines (see startup message).
 *  - `message = message.replace(/\n/g, " ");`
 *  - The indentation of the newlines should be equal to the date+LogLevel-keyword and be clear that it's a continuation of the log-message (without the LogLevel-keyword).
 * @todo Check if LOG_LEVEL matches range or string of valid log levels.
 * @todo Support multiple arguments for helper functions. Logger.debug('a', 'b')
 */

/**
 * Logger class to log messages to the console with colors and levels of importance (DEBUG, INFO, WARNING, ERROR).
 * Also provides helper functions.
 * @class Logger
 */
export class Logger {
  /**
   * A general logger.
   * @param message The message to log.
   * @param logLevel How severe the message is, see LogLevels.
   */
  @compareLogLevels()
  public static log(message: string, logLevel: LogLevel = LogLevel.INFO): void {
    const _now = format(new Date(), '[dd-MM-yyyy - HH:mm:ss]');
    const _padding = `${_now} ${LogLevel[logLevel]} `.length;
    // @ts-ignore TODO
    console.log(`${_now} ${LogColors[LogLevel[logLevel]]}`, LogLevel[logLevel], message.toString().replace(/\n/g, '\n' + ' '.repeat(_padding)));
  }

  /**
   *
   */
  public static debug(message: string): void {
    this.log(message, LogLevel.DEBUG);
  }

  /**
   *
   */
  public static info(message: string): void {
    this.log(message, LogLevel.INFO);
  }

  /**
   *
   */
  public static warning(message: string): void {
    this.log(message, LogLevel.WARNING);
  }

  /**
   *
   */
  public static error(message: string): void {
    this.log(message, LogLevel.ERROR);
  }
}
