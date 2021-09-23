import chalk from 'chalk';

enum LogLevel {
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

/**
 * @todo Allow setting log level using environment variable LOG_LEVEL.
 */

/**
 * Logger class to log messages to the console with colors and levels of importance (DEBUG, INFO, WARNING, ERROR).
 * @class Logger
 */
export class Logger {
  /**
   * A general logger.
   * @param message The message to log.
   * @param severity How severe the message is, see LogLevel.
   */
  public static log(message: string, severity: LogLevel = LogLevel.INFO): void {
    console.log(LogColors[LogLevel[severity]], LogLevel[severity], message);
  }
  
  public static debug (message: string): void {
    this.log(message, LogLevel.DEBUG);
  }

  public static info (message: string): void {
    this.log(message, LogLevel.INFO);
  }

  public static warning (message: string): void {
    this.log(message, LogLevel.WARNING);
  }

  public static error (message: string): void {
    this.log(message, LogLevel.ERROR);
  }
}