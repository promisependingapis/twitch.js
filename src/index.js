var Logger = require('./utils/logger');
var Exited;

module.exports = {
    // Main
    Client: require('./client/Client'),

    // Utils
    Logger: Logger
};

// End of the program //
process.stdin.resume();
function exitHandler(options, exitCode) {
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

process.on('exit', exitHandler.bind(null,{}));
process.on('SIGINT', exitHandler.bind(null, {}));
process.on('SIGUSR1', exitHandler.bind(null, {}));
process.on('SIGUSR2', exitHandler.bind(null, {}));
process.on('uncaughtException', exitHandler.bind(null, {uncaughtException:true}));