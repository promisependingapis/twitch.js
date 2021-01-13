const path = require('path');
var dateParser = require(path.resolve(__dirname,'dateParser'));
var chalk = require('chalk');
var debug;

function activeDebug() {
    debug = true;
    this.debug = logger('debug');
}

function log(Gravity) {
    return function (Message) {
        var Chalker;
        var Msg = `[${dateParser.getTime()}] ${Gravity}: ${Message}`;
        switch (Gravity) {
            case 'fatal':
                if (Message.toString().split(' ')[0].toLowerCase().includes('error')) {
                    Msg = `[${dateParser.getTime()}] ${Gravity} ${Message}`;
                } else {
                    Msg = `[${dateParser.getTime()}] ${Gravity}: ${Message}`;
                }
                console.trace(chalk.bgWhite(chalk.red(Msg)));
                process.exit(5);
                break;
            case 'error':
                Chalker = chalk.red(Msg);
                break;
            case 'warn':
                Chalker = chalk.keyword('orange')(Msg);
                break;
            case 'info':
                Msg = `${Gravity}: ${Message}`;
                Chalker = chalk.blueBright(`[${dateParser.getTime()}] `) + Msg;
                break;
            case 'debug':
                Msg = `${Message}`;
                Chalker = chalk.gray(`[${dateParser.getTime()}] ${Gravity}: `) + chalk.hex('#AAA')(Msg);
                break;
        }
        console[Gravity](Chalker);
    };
}

function logger(Gravity) {
    if ((Gravity === 'debug' && debug) || Gravity !== 'debug') {
        return log(Gravity);
    } else {
        return () => {};
    }
}

module.exports = {
    activeDebug: activeDebug,
    fatal: logger('fatal'),
    error: logger('error'),
    warn: logger('warn'),
    info: logger('info'),
    debug: logger('debug'),
};
