// eslint-disable-next-line strict
'use strict';

const SLEEPTMethods = require('./SLEEPTMethods');

/**
 * The manager for all things than envolve Sleept
 */
class SLEEPTMananger {
    constructor(client) {
        this.client = client;
        this.methods = new SLEEPTMethods(this);
    }
}

module.exports = SLEEPTMananger;