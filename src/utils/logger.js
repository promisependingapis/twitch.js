// eslint-disable-next-line strict
'use strict';

const path = require('path');
const dateParser = require(path.resolve(__dirname,'DateParser'));
const chalk = require('chalk');

/**
 * The logger class
 */
class logger {
    /**
     * @class
     * @param {object} [options] 
     */
    constructor(options) {
        this.debugActive = options ? options.debug : false;
    }

    /**
     * Logs a message to the console as fatal
     * @param {string} Message the message to log
     * @example
     * logger.fatal('This is a fatal message');
     * // [2020-01-01 00:00:00] Fatal: This is a fatal message
     * // Process exited!
     * @returns {void} prints the fatal message to the console and exits the process
     */
    fatal(Message) {
        // eslint-disable-next-line max-len
        console.trace(chalk.bgWhite(chalk.red(Message.toString().split(' ')[0].toLowerCase().includes('error') ? `[${dateParser.getTime()}] Fatal ${Message}` : `[${dateParser.getTime()}] Fatal: ${Message}`)));
        process.exit(5);
    }
    
    /**
     * Logs a message to the console as error
     * @param {string} Message the message to log
     * @example
     * logger.error('This is an error message');
     * // [2020-01-01 00:00:00] Error: This is an error message
     * @returns {void} prints the error message to the console
     **/
    error(Message) {
        // eslint-disable-next-line max-len
        console.error(chalk.red(Message.toString().split(' ')[0].toLowerCase().includes('error') ? `[${dateParser.getTime()}] ${Message}` : `[${dateParser.getTime()}] Error: ${Message}`));
    }
    
    /**
     * Logs a message to the console as warning
     * @param {string} Message the message to log
     * @example
     * logger.warn('This is a warning message');
     * // [2020-01-01 00:00:00] Warn: This is a warning message
     * @returns {void} prints the warning message to the console
     **/
    warn(Message) {
        console.warn(chalk.keyword('orange')(`[${dateParser.getTime()}] Warn: ${Message}`));
    }

    /**
     * Logs a message to the console as info
     * @param {string} Message the message to log
     * @example
     * logger.info('This is an info message');
     * @returns {void} prints the info message to the console
     **/
    info(Message) {
        console.info(chalk.blueBright(`[${dateParser.getTime()}] `) + `Info: ${Message}`);
    }

    /**
     * Logs a message to the console as debug (if debug is enabled)
     * @param {string} Message the message to log
     * @example
     * logger.debug('This is a debug message');
     * // [2020-01-01 00:00:00] Debug: This is a debug message
     * @returns {void} prints the debug message to the console
     **/
    debug(Message) {
        if (this.debugActive) {
            console.debug(chalk.gray(`[${dateParser.getTime()}] Debug: `) + chalk.hex('#AAA')(Message));
        }
    }
}

module.exports = logger;
