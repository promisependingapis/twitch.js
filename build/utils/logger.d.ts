import { ILoggerOptions, ILoggerLevel } from '../interface';
export declare class Logger {
    private defaultLevel;
    private debugActive;
    private prefix?;
    constructor({ prefix, debug, defaultLevel }: ILoggerOptions);
    private getFormattedPrefix;
    private getTime;
    info(text: string | Number | Error, ...args: any): void;
    warn(text: string | Number | Error, ...args: any): void;
    error(text: string | Number | Error, ...args: any): void;
    fatal(text: string | Number | Error, ...args: any): void;
    debug(text: string | Number | Error, ...args: any): void;
    log(message: string | Number | Error, level?: ILoggerLevel, ...args: any): void;
}
//# sourceMappingURL=logger.d.ts.map