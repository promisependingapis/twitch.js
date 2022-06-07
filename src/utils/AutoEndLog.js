// eslint-disable-next-line strict
'use strict';

const path = require('path');

// skipcq: JS-0239
var logger = require(path.resolve(__dirname,'logger'));
logger = new logger();

// skipcq: JS-0239
var exited;

/**
 * Application exit handler
 * @param {object} [options] 
 * @param {?number} [exitCode] 
 * @private
 */
function exitHandler(options, exitCode) {
    process.stdin.resume();
    if (!exited) {
        if (exitCode == 'SIGINT') {
            logger.warn('Manualy finished');
        } else {
            if ((exitCode || exitCode === 0) && !options.uncaughtException) logger.info('Program finished, code: ' + exitCode);
            if ((exitCode || exitCode === 0) && options.uncaughtException) logger.fatal(exitCode);
        }
        exited = true;
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
