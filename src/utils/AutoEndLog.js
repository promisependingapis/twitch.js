var Logger = require('./logger');
var Exited;

function exitHandler(options, exitCode) {
    process.stdin.resume();
    if (!Exited) {
        if (exitCode === 'SIGINT') {
            Logger.Warn('Manualy finished');
        } else {
            if ((exitCode || exitCode === 0) && !options.uncaughtException) Logger.Info('Program finished, code: ' + exitCode);
            if ((exitCode || exitCode === 0) && options.uncaughtException) Logger.Fatal(exitCode);
        }
        Exited = true;
    }
    process.exit();
}

module.exports = {
    Activate: () => {
        process.on('exit', exitHandler.bind(null,{}));
        process.on('SIGINT', exitHandler.bind(null, {}));
        process.on('SIGUSR1', exitHandler.bind(null, {}));
        process.on('SIGUSR2', exitHandler.bind(null, {}));
        process.on('uncaughtException', exitHandler.bind(null, {uncaughtException:true}));
    },
    Desactivate: () => {
        process.removeListener('exit', exitHandler.bind(null,{}));
        process.removeListener('SIGINT', exitHandler.bind(null, {}));
        process.removeListener('SIGUSR1', exitHandler.bind(null, {}));
        process.removeListener('SIGUSR2', exitHandler.bind(null, {}));
        process.removeListener('uncaughtException', exitHandler.bind(null, {uncaughtException:true}));
    }
};