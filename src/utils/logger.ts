import { ILoggerOptions, ELoggerLevel } from '../interfaces';
import chalk from 'chalk';

export class Logger {
  private defaultLevel: ELoggerLevel = ELoggerLevel.LOG;
  private debugActive = false;
  private prefix?: string;
  private coloredBackground: boolean;
  private colors: any;
  private disableFatalCrash: boolean;

  constructor({ prefix, debug, defaultLevel, coloredBackground, disableFatalCrash }: ILoggerOptions) {
    this.prefix = prefix ?? '';
    this.debugActive = debug ?? false;
    this.defaultLevel = defaultLevel ?? ELoggerLevel.INFO;
    this.coloredBackground = coloredBackground ?? false;
    this.disableFatalCrash = disableFatalCrash ?? false;

    this.colors = {
      info: '#cc80ff',
      warn: '#ff8a1c',
      error: '#ff4a4a',
    };
  }

  private getFormattedPrefix(): string {
    var prefix = '';
    prefix += chalk.hex('#5c5c5c')('[');
    prefix += chalk.gray(this.prefix);
    prefix += chalk.hex('#5c5c5c')(']');

    return this.prefix !== '' ? prefix : '';
  }

  private getTime(): string {
    const time = new Date(Date.now());
    const seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    const hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    return `[${hours}:${minutes}:${seconds}]`;
  }

  info(text: string | number | Error, ...args: any): void {
    var textConstructor = '';
    textConstructor += this.coloredBackground ? this.getTime() : chalk.hex(this.colors.info)(this.getTime());
    textConstructor += this.coloredBackground ? `[${this.prefix}]` : this.getFormattedPrefix();

    textConstructor += ' Info:';

    if (this.coloredBackground) {
      textConstructor = chalk.bgHex(this.colors.info)(chalk.black(textConstructor));
    }

    textConstructor += ' ' + text;

    if ((!args && !(args instanceof Boolean)) || ((args instanceof Array) && args.length === 0)) {
      console.log(textConstructor);
    } else {
      console.log(textConstructor, args);
    }
  }

  warn(text: string | number | Error, ...args: any): void {
    var textConstructor = '';
    textConstructor += this.coloredBackground ? this.getTime() : chalk.hex(this.colors.warn)(this.getTime());
    textConstructor += this.coloredBackground ? `[${this.prefix}]` : this.getFormattedPrefix();

    textConstructor += ` ${text.toString().toLowerCase().split(' ')[0].includes('warn') ? '' : 'Warn:'}`;

    if (this.coloredBackground) {
      textConstructor = chalk.bgHex(this.colors.warn)(chalk.black(textConstructor));
    }

    textConstructor += ' ' + text;

    if ((!args && !(args instanceof Boolean)) || ((args instanceof Array) && args.length === 0)) {
      console.warn(textConstructor);
    } else {
      console.warn(textConstructor, args);
    }
  }

  error(text: string | number | Error, ...args: any): void {
    var textConstructor = '';
    textConstructor += this.coloredBackground ? this.getTime() : chalk.hex(this.colors.error)(this.getTime());
    textConstructor += this.coloredBackground ? `[${this.prefix}]` : this.getFormattedPrefix();

    textConstructor += `${text.toString().toLowerCase().split(' ')[0].includes('error') ? '' : ' Error:'}`;

    if (this.coloredBackground) {
      textConstructor = chalk.bgHex(this.colors.error)(chalk.black(textConstructor));
    }

    textConstructor += ' ' + text;

    if ((!args && !(args instanceof Boolean)) || ((args instanceof Array) && args.length === 0)) {
      console.error(textConstructor);
    } else {
      console.error(textConstructor, args);
    }
  }

  fatal(text: string | number | Error, ...args: any): void {
    var textConstructor = '';
    textConstructor += chalk.hex('#ff5647')(this.getTime());
    textConstructor += this.getFormattedPrefix();
    textConstructor += ` Fatal${text.toString().toLowerCase().split(' ')[0].includes('error') ? '' : ':'} `;
    textConstructor += text.toString().split('\n')[0];

    textConstructor = chalk.bgWhite(chalk.red(textConstructor));

    textConstructor += '\n';
    textConstructor += text.toString().split('\n').slice(1).join('\n');

    if ((!args && !(args instanceof Boolean)) || ((args instanceof Array) && args.length === 0)) {
      console.error(textConstructor);
    } else {
      console.error(textConstructor, args);
    }

    if (!this.disableFatalCrash) {
      process.exit(5);
    }
  }

  debug(text: string | number | Error, ...args: any): void {
    if (!this.debugActive) return;
    var textConstructor = '';
    textConstructor += chalk.hex('#555555')(this.getTime());
    textConstructor += this.getFormattedPrefix();
    textConstructor += chalk.hex('#555555')(`${text.toString().toLowerCase().split(' ')[0].includes('debug') ? '' : ' Debug:'} `);
    textConstructor += chalk.hex('#555555')(text);

    if (((!args && !(args instanceof Boolean)) || ((args instanceof Array) && args.length === 0)) || ((args instanceof Array) && args.length === 0)) {
      console.debug(textConstructor);
    } else {
      console.debug(textConstructor, args);
    }
  }

  log(message: string | number | Error, level?: ELoggerLevel, ...args: any): void {
    level = level ?? this.defaultLevel;
    switch (level) {
      case ELoggerLevel.DEBUG:
        this.debug(message, args);
        break;
      case ELoggerLevel.WARN:
      case ELoggerLevel.ALERT:
        this.warn(message, args);
        break;
      case ELoggerLevel.ERROR:
      case ELoggerLevel.SEVERE:
        this.error(message, args);
        break;
      case ELoggerLevel.FATAL:
        this.fatal(message, args);
        break;
      case ELoggerLevel.INFO:
      case ELoggerLevel.LOG:
      default:
        this.info(message, args);
        break;
    }
  }
}
