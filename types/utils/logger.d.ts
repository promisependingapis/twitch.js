export = logger;
declare class logger {
    constructor(options: any);
    debugActive: any;
    /**
     * Logs a message to the console as fatal
     * @param {string} Message the message to log
     * @returns {void} prints the fatal message to the console and exits the process
     * @example
     * logger.fatal('This is a fatal message');
     * // [2020-01-01 00:00:00] Fatal: This is a fatal message
     * // Process exited!
     */
    fatal(Message: string): void;
    /**
     * Logs a message to the console as error
     * @param {string} Message the message to log
     * @returns {void} prints the error message to the console
     * @example
     * logger.error('This is an error message');
     * // [2020-01-01 00:00:00] Error: This is an error message
     **/
    error(Message: string): void;
    /**
     * Logs a message to the console as warning
     * @param {string} Message the message to log
     * @returns {void} prints the warning message to the console
     * @example
     * logger.warn('This is a warning message');
     * // [2020-01-01 00:00:00] Warn: This is a warning message
     **/
    warn(Message: string): void;
    /**
     * Logs a message to the console as info
     * @param {string} Message the message to log
     * @returns {void} prints the info message to the console
     * @example
     * logger.info('This is an info message');
     **/
    info(Message: string): void;
    /**
     * Logs a message to the console as debug (if debug is enabled)
     * @param {string} Message the message to log
     * @returns {void} prints the debug message to the console
     * @example
     * logger.debug('This is a debug message');
     * // [2020-01-01 00:00:00] Debug: This is a debug message
     **/
    debug(Message: string): void;
}
//# sourceMappingURL=logger.d.ts.map