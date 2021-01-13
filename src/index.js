const path = require('path');

module.exports = {
    // Main
    Client: require(path.resolve(__dirname,'client','Client')),
    // Utils
    logger: require(path.resolve(__dirname,'utils','logger')),
};
