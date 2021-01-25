const path = require('path');
var dateParser = require(path.resolve(__dirname,'DateParser'));
var chalk = require('chalk');

class logger {
    constructor(options) {
        this.debugActive = options ? options.debug : false;
    }

    fatal(Message) {
        // eslint-disable-next-line max-len
        console.trace(chalk.bgWhite(chalk.red(Message.toString().split(' ')[0].toLowerCase().includes('error') ? `[${dateParser.getTime()}] Fatal ${Message}` : `[${dateParser.getTime()}] Fatal: ${Message}`)));
        process.exit(5);
    }
    
    error(Message) {
        // eslint-disable-next-line max-len
        console.error(chalk.red(Message.toString().split(' ')[0].toLowerCase().includes('error') ? `[${dateParser.getTime()}] ${Message}` : `[${dateParser.getTime()}] Error: ${Message}`));
    }
    
    warn(Message) {
        console.warn(chalk.keyword('orange')(`[${dateParser.getTime()}] Warn: ${Message}`));
    }

    info(Message) {
        console.info(chalk.blueBright(`[${dateParser.getTime()}] `) + `Info: ${Message}`);
    }

    debug(Message) {
        if (this.debugActive) {
            console.debug(chalk.gray(`[${dateParser.getTime()}] Debug: `) + chalk.hex('#AAA')(Message));
        }
    }
}

module.exports = logger;
