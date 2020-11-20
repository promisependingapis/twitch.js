const EventEmmiter = require('events');
const SLEEPTManager = require('../sleept/SLEEPTMananger');
const { AutoEndLog, Constants, logger, Util } = require('../utils');

/**
 * @TODO fanMode (Anonymous mode)
 */

/**
 * Creates de main class to generate clients.
 * @extends {EventEmmiter}
 */
class Client extends EventEmmiter {
    /**
     * @param {ClientOptions} [AutoLogEnd Boolean, Default: false]
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
         * Defines the options as a organized global variable to use in 
         */
        global.TwitchApis = {
            Client: {
                Option: this.options
            }
        };

        /**
         * Active Debug if Debug have to be activate
         */
        if (global.TwitchApis.Client.Option.Debug) {
            logger.ActiveDebug();
        }

        logger.Debug('Debug is active!');

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

        /**
         * The bool of the system of auto logger finish event
         * @type {Bool}
         */
        this.AutoLogEnd = options.AutoLogEnd;
        
        /**
         * Activates the AutoEndLog depending of user config, Default 'active'
         */
        if (this.AutoLogEnd) {
            AutoEndLog.Activate();
        }

        /**
         * The array of channels than the bot will work in
         * @type {array}
         */
        this.Channels = options.Channels;
    }

    /**
     * Logs the client in, establishing a websocket connection to Twitch.
     * @param {string} token Token of the account to log in with
     * @returns {Promise<string>} Token of the account used
     * @example
     * Client.login('my oauth token')
     *  .then()
     */
    login(token = this.token) {
        return this.sleept.methods.login(token);
    }

    /**
     * Validates the client options.
     * @param {ClientOptions} [options=this.options] Options to validate
     * @private
     */
    _validateOptions(options = this.options) { // eslint-disable-line complexity
        if (typeof options.messageCacheMaxSize !== 'number' || isNaN(options.messageCacheMaxSize)) {
            throw new TypeError('The messageMaxSize option must be a number.');
        }
        if (typeof options.messageCacheLifetime !== 'number' || isNaN(options.messageCacheLifetime)) {
            throw new TypeError('The messageCacheLifetime option must be a number.');
        }
        if (typeof options.messageSweepInterval !== 'number' || isNaN(options.messageSweepInterval)) {
            throw new TypeError('The messageSweepInterval option must be a number.');
        }
        if (typeof options.fetchAllMembers !== 'boolean') {
            throw new TypeError('The fetchAllMembers option must be a boolean.');
        }
        if (typeof options.sleeptWsBridgeTimeout !== 'number' || isNaN(options.sleeptWsBridgeTimeout)) {
            throw new TypeError('The sleeptWsBridgeTimeout option must be a number.');
        }
        if (!(options.disabledEvents instanceof Array)) throw new TypeError('The disabledEvents option must be an Array.');
        if (typeof options.retryLimit !== 'number' || isNaN(options.retryLimit)) {
            throw new TypeError('The retryLimit  options must be a number.');
        }
        if (options.AutoLogEnd && typeof options.AutoLogEnd !== 'boolean') {
            throw new TypeError('The AutoLogEnd options must be a boolean.');
        }
        if (options.Channels && typeof options.Channels !== 'object') {
            throw new TypeError('The Channel(s) options must be a array.');
        }
        if (options.UserName && typeof options.UserName !== 'string') {
            throw new TypeError('The UserName options must be a string.');
        }
        if (options.Debug && typeof options.Debug !== 'boolean') {
            throw new TypeError('The Debug options must be a boolean.');
        }
        Object.keys(options).forEach((OptionName) => {
            if (!Object.keys(Constants.DefaultOptions).includes(OptionName)) {
                AutoEndLog.Activate();
                throw new TypeError('The option: ' + OptionName + ' is not a valid option.');
            }
        });
    }
}

module.exports = Client;