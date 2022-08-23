// eslint-disable-next-line strict
'use strict';

const Client = require('./client/Client');
const Collection = require('./utils/collection');
const logger = require('./utils/logger');

module.exports = {
    /**
     * The client
     * @type {Client}
     * @class
     */
    Client,
    /**
     * Collection utility
     * @type {Collection}
     * @class
     */
    Collection,
    /**
     * The logger
     * @type {logger}
     * @class
     */
    logger
};
