"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const _1 = require("./");
var exited = false;
const logger = new _1.Logger({ prefix: 'SYSTEM' });
function exitHandler(options, exitCode) {
    if (!exited) {
        process.stdin.resume();
        exited = true;
        if (typeof exitCode === 'string') {
            logger.warn('Manually Finished!');
        }
        else {
            if ((exitCode || exitCode === 0) && !options.uncaughtException)
                logger.info('Program finished, code: ' + exitCode);
            if ((exitCode || exitCode === 0) && options.uncaughtException)
                logger.fatal(exitCode);
        }
        process.exit(typeof exitCode === 'string' ? 0 : exitCode);
    }
}
function activate(uncaughtException) {
    process.on('exit', exitHandler.bind(null, {}));
    process.on('SIGINT', exitHandler.bind(null, {}));
    process.on('SIGUSR1', exitHandler.bind(null, {}));
    process.on('SIGUSR2', exitHandler.bind(null, {}));
    process.on('uncaughtException', exitHandler.bind(null, { uncaughtException: uncaughtException !== null && uncaughtException !== void 0 ? uncaughtException : false }));
}
exports.activate = activate;
