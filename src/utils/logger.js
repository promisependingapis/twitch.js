/* eslint-disable indent */
var DateParser = require('./DateParser');
var chalk = require('chalk');

var debug = true;

function log(Gravity) {
    return function(Message) {
        var Chalker;
        var level = '';
        var Msg = `[${DateParser.getTime()}] ${Gravity}: ${Message}`;
        switch (Gravity) {
            case 'Fatal':
                if (Message.toString().split(' ')[0].toLowerCase().includes('error')) {
                    Msg = `[${DateParser.getTime()}] ${Gravity} ${Message}`;
                } else {
                    Msg = `[${DateParser.getTime()}] ${Gravity}: ${Message}`;
                }
                console.trace(chalk.bgWhite(chalk.red(Msg)));
                process.exit(5);
            break;
            case 'Error':
                level = 'error';
                Chalker = chalk.red(Msg);
            break;
            case 'Warn':
                level = 'warn';
                Chalker = chalk.keyword('orange')(Msg);
            break;
            case 'Info':
                level = 'log';
                Msg = `${Gravity}: ${Message}`;
                Chalker = chalk.blueBright(`[${DateParser.getTime()}] `) + Msg;
            break;
            case 'Debug':
                level = 'debug';
                Msg = `${Message}`;
                Chalker = chalk.gray(`[${DateParser.getTime()}] ${Gravity}: `) + Msg;
            break;
        }
        console[level](Chalker);
    };
}

function logger(Gravity) {
    if ((Gravity === 'Debug' && debug === true) || (Gravity !== 'Debug')) {
        return log(Gravity);
    }
}

module.exports = {
    Fatal: logger('Fatal'),
    Error: logger('Error'),
    Warn: logger('Warn'),
    Info: logger('Info'),
    Debug: logger('Debug')
};