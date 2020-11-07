const EventEmmiter = require('events');
const SLEEPTManager = require('../sleept/SLEEPTMananger');
const Constants = require('../utils/Constants');
const Util = require('../utils/util');

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
        
        Object.defineProperty(this, 'token', { writable: true });
        if (!this.token && 'CLIENT_TOKEN' in process.env) {
            /**
             * Authorization token for the logged in user/bot
             * <warn>This should be kept private at all times.</warn>
             * @type {?string}
             */
            this.token = process.env.CLIENT_TOKEN;
        } else {
            this.token = null;
        }

        /**
         * User that the client is logged in as
         * @type {?ClientUser}
         */
        this.user = null;

        /**
         * Time at which the client was last regarded as being in the `READY` state
         * (each time the client disconnects and successfully reconnects, this will be overwritten)
         * @type {?Date}
         */
        this.readyAt = null;

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

module.exports = Client;