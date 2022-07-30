/* eslint-disable no-unused-vars */

export enum ELoggerLevel {
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
    defaultLevel?: ELoggerLevel;
    prefix?: string;
    debug?: boolean;
    coloredBackground?: boolean;
    disableFatalCrash?: boolean;
}
