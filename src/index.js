"use strict";
const path = require('path');

module.exports = {
    // Main
    Client: require(path.resolve(__dirname,'client','Client')),
    // Utils
    Collection: require(path.resolve(__dirname,'utils','collection')),
    logger: require(path.resolve(__dirname,'utils','logger')),
};
