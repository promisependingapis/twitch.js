import { ILoggerOptions, ELoggerLevel } from '../interfaces';
export declare class Logger {
    private defaultLevel;
    private debugActive;
    private prefix?;
    private coloredBackground;
    private colors;
    private disableFatalCrash;
    constructor({ prefix, debug, defaultLevel, coloredBackground, disableFatalCrash }: ILoggerOptions);
    private getFormattedPrefix;
    private getTime;
    info(text: string | number | Error, ...args: any): void;
    warn(text: string | number | Error, ...args: any): void;
    error(text: string | number | Error, ...args: any): void;
    fatal(text: string | number | Error, ...args: any): void;
    debug(text: string | number | Error, ...args: any): void;
    log(message: string | number | Error, level?: ELoggerLevel, ...args: any): void;
}
//# sourceMappingURL=logger.d.ts.map