// eslint-disable-next-line strict
'use strict';

const WSMethods = require('./WSMethods');

/**
 * The manager for all things than envolve WebSocket.
 * @private
 */
class WSMananger {
    constructor(client) {
        this.client = client;
        this.methods = new WSMethods(this);
    }
}

module.exports = WSMananger;
