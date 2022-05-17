// eslint-disable-next-line strict
'use strict';

const path = require('path');
const EventEmmiter = require('events');
const WSManager = require(path.resolve(__dirname,'..','web','WSManager'));
const { autoEndLog, constants, logger: LoggerC, Util, collection } = require(path.resolve(__dirname,'..','utils'));
const channel = require(path.resolve(__dirname,'..','structures','channels'));

// skipcq: JS-0239
var logger;
// skipcq: JS-0239
var wsManager;

/**
 * Creates the main class to generate clients.
 * @extends {EventEmmiter}
 */
class Client extends EventEmmiter {
    /**
     * @type {ClientOptions} [autoLogEnd boolean, Default: true]
     */
    constructor(options = {}) {
        super();
        /**
         * The options the client was instantiated with
         * @type {ClientOptions}
         */
        this.options = Util.mergeDefault(constants.defaultOptions, options);
        this._validateOptions();

        logger = new LoggerC({debug:this.options.debug});

        /**
         * Display a message saying debug is active is debug is active
         */
        logger.debug('Debug is active!');

        Object.defineProperty(this, 'token', { writable: true });

        /**
         * Load client token from process enviroment if its not passed on login
         */
        if (!this.token && 'CLIENT_TOKEN' in process.env) {
            /**
             * Authorization token for the logged in user/bot
             * <warn>This should be kept private at all times.</warn>
             * @type {?string}
             * @private
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
         * @type {boolean}
         */
        this.autoLogEnd = options.autoLogEnd;

        /**
         * Disable autoLogEnd if debug is actived for complete stacktraces
         * also display a warn saying that
         */
        if (this.options.debug && this.autoLogEnd) {
            logger.warn('AutoLogEnd disabled because debug is enabled');
        }

        /**
         * Activates the autoEndLog depending of user config, Default 'active'
         */
        if (this.autoLogEnd && !this.options.debug) {
            autoEndLog.activate();
        }

        /**
         * A collection with all channels
         * @type {Collection}
         */
        this.channels = new collection();
        /**
         * Create the channel collection for each channel
         */
        options.channels.forEach((channelName) => {
            if (channelName.slice(0, 1) !== '#') {
                channelName = '#' + channelName;
            }
            this.channels.set(channelName, new channel(this, { channel: channelName }));
            this.channels.get = (channelName2) => {
                if (channelName2.slice(0, 1) !== '#') {
                    channelName2 = '#' + channelName2;
                }
                return this.channels.find((channelC) => channelC.name === channelName2);
            };
        });

        /**
         * The WebSocket manager of the client
         * @type {WSManager}
         * @private
         */
        this.wsManager = new WSManager(this);

        wsManager = this.wsManager;

        this.ws = {
            send: (websocketstring) => {
                return wsManager.methods.sendRawMessage(websocketstring);
            }
        };
    }

    /**
     * Returns the time bot is connected with twitch in miliseconds
     * @returns {Promise<number>}
     * @example
     * await Client.uptime()
     * @example
     * Client.uptime().then((Time) => { })
     */
    uptime() {
        return Promise.resolve(Date.now() - this.readyAt);
    }

    /**
     * Logs the client in, establishing a websocket connection to Twitch.
     * @param {string} [token] Token of the account to log in with (Opcional)
     * @param {boolean} [false] False to Anonymous mode (Opcional)
     * @returns {Promise<Pending>}
     * @example
     * Client.login('token')
     *  .then()
     * @example
     * Client.login(false)
     *  .then()
     */
    login(token) {
        return this.wsManager.methods.login(token);
    }

    /**
     * Join the bot on the channel parsed
     * @param {string} [channelName] The name of the channel the bot will connect
     * @returns {Promise<boolean>} true if the bot connect, false if it cannot connect
     * @example
     * client.join('channelName')
     *  .then()
     */
    join(channelName) {
        return this.wsManager.methods.join(channelName);
    }

    /**
     * Leave the bot on the channel parsed
     * @param {string} [channelName] The name of the channel the bot will disconnect
     * @returns {Promise<boolean>} true if the bot disconnect, false if it cannot disconnect
     * @example
     * client.leave('channelName')
     *  .then()
     */
    leave(channelName) {
        return this.wsManager.methods.leave(channelName);
    }

    /**
     * Get the API ping
     * @returns {Promise<number>} return the API ping in milliseconds
     * @example
     * client.ping()
     */
    ping() {
        return this.wsManager.methods.ping();
    }

    /**
     * Emit a event from client level
     * @param {string} event the name of the event than will be sended
     * @param {Any} args the args of the event
     * @example
     * client.eventEmmiter('event', Args)
     */
    eventEmmiter(event, ...args) {
        switch (event) {
            case 'message':
                this.emit(event, {
                    /**
                     * @returns {string} text content of message
                     */
                    toString() {
                        return this.content;
                    },
                    /**
                     * @type {string} The string of context text of message
                     */
                    content: args[0].params[1].toString(),
                    /**
                     * responds the author of message
                     * @param {string} [message] the message than will be sended as reply of original message
                     * @return {Promise<Pending>} The message sended metadata
                     */
                    reply: (message) => {
                        // eslint-disable-next-line max-len
                        return this.wsManager.methods.replyMessage(args[0].tags.id, args[0].params[0], message);
                    },
                    id: args[0].tags.id,
                    channel: this.channels.get(args[0].params[0]),
                    author: this.channels.get(args[0].params[0]).users.get(args[0].prefix.slice(0, args[0].prefix.indexOf('!'))),
                });
                break;
            default:
                this.emit(event, ...args);
                break;
        }
    }

    /**
     * Disconnect client from TwitchIRC
     * @returns {Promise<Pending>} returned when client disconnect.
     */
    disconnect() {
        return this.wsManager.methods.disconnect();
    }

    /**
     * Validates the client options.
     * @param {ClientOptions} [options=this.options] Options to validate
     * @private
     */
    _validateOptions(options = this.options) {
        const ErrorMessage = [];

        if (typeof options.messageCacheMaxSize !== 'number' || isNaN(options.messageCacheMaxSize)) {
            ErrorMessage.push('The messageMaxSize option must be a number.');
        }
        
        if (typeof options.messageCacheLifetime !== 'number' || isNaN(options.messageCacheLifetime)) {
            ErrorMessage.push('The messageCacheLifetime option must be a number.');
        }
        
        if (typeof options.messageSweepInterval !== 'number' || isNaN(options.messageSweepInterval)) {
            ErrorMessage.push('The messageSweepInterval option must be a number.');
        }
        
        if (typeof options.fetchAllChatters !== 'boolean') {
            ErrorMessage.push('The fetchAllChatters option must be a boolean.');
        }

        if (options.disabledEvents && !(options.disabledEvents instanceof Array)) {
            ErrorMessage.push('The disabledEvents option must be an Array.');
        }

        if (typeof options.retryLimit !== 'number' || isNaN(options.retryLimit)) {
            ErrorMessage.push('The retryLimit options must be a number.');
        }

        if (options.autoLogEnd && typeof options.autoLogEnd !== 'boolean') {
            ErrorMessage.push('The autoLogEnd options must be a boolean.');
        }

        if (options.channels && !(options.channels instanceof Array)) {
            ErrorMessage.push('The channels options must be a array.');
        }

        if (options.debug && typeof options.debug !== 'boolean') {
            ErrorMessage.push('The debug options must be a boolean.');
        }
        
        if (options.connectedChannels && !(options.channels instanceof Array) && options.connectedChannels.length > 0) {
            ErrorMessage.push('The connectedChannels options must be a array and must be empty.');
        }

        if (ErrorMessage.length > 0) {
            throw new TypeError(ErrorMessage.join(' and '));
        }
    }
}

module.exports = Client;
