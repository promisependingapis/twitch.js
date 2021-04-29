// eslint-disable-next-line strict
'use strict';

const path = require('path');

module.exports = {
    constants: require(path.resolve(__dirname,'Constants')),
    Util: require(path.resolve(__dirname,'util')),
    logger: require(path.resolve(__dirname,'logger')),
    autoEndLog: require(path.resolve(__dirname,'AutoEndLog')),
    parser: require(path.resolve(__dirname,'parser')),
    collection: require(path.resolve(__dirname,'collection')),
};
