import chalk from 'chalk';
import { LOG_LEVEL } from '../config';

enum LogLevels {
  DEBUG,
  INFO,
  WARNING,
  ERROR
}

const LogColors = {
  DEBUG: chalk.green('%s'),
  INFO: chalk.blue('%s'),
  WARNING: chalk.yellow('%s'),
  ERROR: chalk.red('%s')
}

function checkLogLevel () {
  return function (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const childFunction = descriptor.value;
    descriptor.value = (...args: any[]) => {
      if (!args[1]) args[1] = LogLevels.INFO;

      if (args[1] >= LogLevels[LOG_LEVEL]) {
        return childFunction.apply(this, args);
      } else {
        return null;
      }
    };
    return descriptor;
  };
}

/**
 * @todo Add timestamps: '[05-06-2001 - 16:20] ERROR message'
 * @todo Fix newlines (see startup message).
 * @todo Check if LOG_LEVEL matches range or string of valid log levels.
 */

/**
 * Logger class to log messages to the console with colors and levels of importance (DEBUG, INFO, WARNING, ERROR).
 * @class Logger
 */
export class Logger {
  /**
   * A general logger.
   * @param message The message to log.
   * @param logLevel How severe the message is, see LogLevel.
   */
  @checkLogLevel()
  public static log(message: string, logLevel: LogLevels = LogLevels.INFO): void {
    console.log(LogColors[LogLevels[logLevel]], LogLevels[logLevel], message);
  }
  
  public static debug (message: string): void {
    this.log(message, LogLevels.DEBUG);
  }

  public static info (message: string): void {
    this.log(message, LogLevels.INFO);
  }

  public static warning (message: string): void {
    this.log(message, LogLevels.WARNING);
  }

  public static error (message: string): void {
    this.log(message, LogLevels.ERROR);
  }
}