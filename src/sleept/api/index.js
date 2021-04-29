// eslint-disable-next-line strict
'use strict';

const path = require('path');

module.exports = {
    getChatter: require(path.resolve(__dirname,'functions','chatters')),
    validator: require(path.resolve(__dirname,'functions','validator'))
};
