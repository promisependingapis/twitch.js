const EventEmmiter = require('events');
const SleeptMethods = require('../sleept/SLEEPTMethods');
const SLEEPTManager = require('../sleept/SLEEPTMananger');
const Constants = require('../util/Constants');
const Util = require('../util/util');

/**
 * Creates de main class to generate clients.
 * @extends {EventEmmiter}
 */
class Client extends EventEmmiter {
    /**
     * @param {ClientOptions} [options] Options for the client
     */
    constructor(options = {}) {
        super();
        /**   
         * The options the client was instantiated with
         * @type {ClientOptions}
         */
        this.options = Util.mergeDefault(Constants.DefaultOptions, options);
        this._validateOptions();

        /**
         * The SLEEPT manager of the client
         * @type {SLEEPTManager}
         * @private
         */
        this.sleept = new SLEEPTManager(this);
    }

    /**
     * Logs the client in, establishing a websocket connection to Twitch.
     * @param {string} token Token of the account to log in with
     * @returns {Promise<string>} Token of the account used
     * @example
     * Client.login('my token')
     *  .then()
     */
    login(token = this.token) {
        return this.sleept.methods.login(token);
    }
}