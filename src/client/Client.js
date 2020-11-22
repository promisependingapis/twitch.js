const EventEmmiter = require('events');
const SLEEPTManager = require('../sleept/SLEEPTMananger');
const { autoEndLog, constants, logger, Util } = require('../utils');

/**
 * @TODO fanMode (Anonymous mode)
 */

/**
 * Creates de main class to generate clients.
 * @extends {EventEmmiter}
 */
class Client extends EventEmmiter {
    /**
     * @param {ClientOptions} [autoLogEnd Boolean, Default: false]
     */
    constructor(options = {}) {
        super();
        /**   
         * The options the client was instantiated with
         * @type {ClientOptions}
         */
        this.options = Util.mergeDefault(constants.defaultOptions, options);
        this._validateOptions();

        /**
         * Defines the options as a organized global variable to use in 
         */
        global.twitchApis = {
            client: {
                option: this.options
            }
        };

        /**
         * Active Debug if Debug have to be activate
         */
        if (this.options.debug) {
            logger.activeDebug();
        }

        logger.debug('Debug is active!');

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
        this.autoLogEnd = options.autoLogEnd;
        
        /**
         * Activates the autoEndLog depending of user config, Default 'active'
         */
        if (this.autoLogEnd) {
            autoEndLog.activate();
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
     * @returns {Promise}
     * @example
     * Client.login('userName', 'token')
     *  .then()
     */
    login(userName, token) {
        return this.sleept.methods.login(userName, token);
    }

    /**
     * Join the bot on the channel parsed
     * @param {string} channelName The name of the channel the bot will connect
     * @returns {Promise<boolean>} true if the bot connect, false if it cannot connect
     * @example
     * client.join('channelName')
     *  .then()
     */
    join(channelName) {
        return this.sleept.methods.join(channelName);
    }

    /**
     * Leave the bot on the channel parsed
     * @param {string} channelName The name of the channel the bot will disconnect
     * @returns {Promise<boolean>} true if the bot disconnect, false if it cannot disconnect
     * @example
     * client.join('channelName')
     *  .then()
     */
    leave(channelName) {
        return this.sleept.methods.leave(channelName);
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
        if (options.autoLogEnd && typeof options.autoLogEnd !== 'boolean') {
            throw new TypeError('The autoLogEnd options must be a boolean.');
        }
        if (options.channels && typeof options.channels !== 'object') {
            throw new TypeError('The channels options must be a array.');
        }
        if (options.debug && typeof options.debug !== 'boolean') {
            throw new TypeError('The debug options must be a boolean.');
        }
        Object.keys(options).forEach((OptionName) => {
            if (!Object.keys(constants.defaultOptions).includes(OptionName)) {
                autoEndLog.activate();
                throw new TypeError('The option: ' + OptionName + ' is not a valid option.');
            }
        });
    }
}

module.exports = Client;