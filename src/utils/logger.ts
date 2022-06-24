import { ILoggerOptions, ILoggerLevel } from '../interface';
import chalk from 'chalk';

export class Logger {
    private defaultLevel: ILoggerLevel = ILoggerLevel.LOG;
    private debugActive: boolean = false;
    private prefix?: string;
    
    constructor({prefix, debug, defaultLevel}: ILoggerOptions) {
        this.prefix = prefix ?? '';
        this.debugActive = debug ?? false;
        this.defaultLevel = defaultLevel ?? ILoggerLevel.INFO;
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

    info(text: string | Number | Error, ...args: any): void {
        var textConstructor = '';
        textConstructor += this.getFormattedPrefix();
        textConstructor += chalk.blueBright(this.getTime());
        textConstructor += ' Info: ';
        textConstructor += text;
        
        console.log(textConstructor, args);
    }

    warn(text: string | Number | Error, ...args: any): void {
        var textConstructor = '';
        textConstructor += this.getFormattedPrefix();
        textConstructor += chalk.hex('#ff8a1c')(this.getTime());
        textConstructor += ` ${text.toString().toLowerCase().split(' ')[0].includes('warn') ? '' : 'Warn:'} `;
        textConstructor += text;
        
        console.warn(textConstructor, args);
    }

    error(text: string | Number | Error, ...args: any): void {
        var textConstructor = '';
        textConstructor += this.getFormattedPrefix();
        textConstructor += chalk.red(this.getTime());
        textConstructor += ` ${text.toString().toLowerCase().split(' ')[0].includes('error') ? '' : 'Error:'} `;
        textConstructor += text;
        
        console.error(textConstructor, args);
    }

    fatal(text: string | Number | Error, ...args: any): void {
        var textConstructor = '';
        textConstructor += this.getFormattedPrefix();
        textConstructor += chalk.hex('#ff8a1c')(this.getTime());
        textConstructor += ` Fatal ${text.toString().toLowerCase().split(' ')[0].includes('error') ? '' : ':'} `;
        textConstructor += text;

        textConstructor = chalk.bgWhite(textConstructor);
        
        console.trace(textConstructor, args);
        process.exit(5);
    }

    debug(text: string | Number | Error, ...args: any): void {
        if (!this.debugActive) return;
        var textConstructor = '';
        textConstructor += this.getFormattedPrefix();
        textConstructor += chalk.hex('#ff8a1c')(this.getTime());
        textConstructor += ` ${text.toString().toLowerCase().split(' ')[0].includes('debug') ? '' : 'Debug:'} `;
        textConstructor += text;
        
        console.debug(textConstructor, args);
    }

    log(message: string | Number | Error, level?: ILoggerLevel, ...args: any): void {
        level = level ?? this.defaultLevel;
        switch (level) {
          case ILoggerLevel.DEBUG:
            this.debug(message, args);
            break;
          case ILoggerLevel.WARN:
          case ILoggerLevel.ALERT:
            this.warn(message, args);
            break;
          case ILoggerLevel.ERROR:
          case ILoggerLevel.SEVERE:
            this.error(message, args);
            break;
          case ILoggerLevel.FATAL:
            this.fatal(message, args);
            break;
          case ILoggerLevel.INFO:
          case ILoggerLevel.LOG:
          default:
            this.info(message, args);
            break;
        }
      }
}
