export declare enum ILoggerLevel {
    INFO = 0,
    LOG = 0,
    WARN = 1,
    ALERT = 1,
    ERROR = 2,
    SEVERE = 2,
    FATAL = 3,
    DEBUG = 4
}
export interface ILoggerOptions {
    debug?: boolean;
    prefix?: string;
    defaultLevel?: ILoggerLevel;
}
//# sourceMappingURL=ILoggerOptions.d.ts.map