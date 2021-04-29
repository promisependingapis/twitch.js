// eslint-disable-next-line strict
'use strict';

const path = require('path');
module.exports = {
    channels: require(path.resolve(__dirname,'channels')),
    users: require(path.resolve(__dirname,'users')),
};
