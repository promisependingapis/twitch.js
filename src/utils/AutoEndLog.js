// eslint-disable-next-line strict
'use strict';

const path = require('path');
var logger = require(path.resolve(__dirname,'logger'));
logger = new logger();
var Exited;

function exitHandler(options, exitCode) {
    process.stdin.resume();
    if (!Exited) {
        if (exitCode === 'SIGINT') {
            logger.warn('Manualy finished');
        } else {
            if ((exitCode || exitCode === 0) && !options.uncaughtException) logger.info('Program finished, code: ' + exitCode);
            if ((exitCode || exitCode === 0) && options.uncaughtException) logger.fatal(exitCode);
        }
        Exited = true;
    }
    process.exit();
}

module.exports = {
    activate: () => {
        process.on('exit', exitHandler.bind(null, {}));
        process.on('SIGINT', exitHandler.bind(null, {}));
        process.on('SIGUSR1', exitHandler.bind(null, {}));
        process.on('SIGUSR2', exitHandler.bind(null, {}));
        process.on('uncaughtException', exitHandler.bind(null, { uncaughtException: true }));
    },
};
