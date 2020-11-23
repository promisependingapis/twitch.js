const EventEmmiter = require('events');
const SLEEPTManager = require('../sleept/SLEEPTMananger');
const { autoEndLog, constants, logger, Util } = require('../utils');

/**
 * @TODO FanMode (Anonymous mode).
 * @TODO Organize annotations.
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
        global.twitchApis.client.methods = {
            joinQueueTimeout: [],  
            leaveQueueTimeout: [],  
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
     * @param {string} userName Username of the account to log in with
     * @param {string} token Token of the account to log in with
     * @returns {Promise<pending>}
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
     * emit a event from client level
     * @param {string} event the name of the event than will be sended
     * @param {any} args the args of the event
     * @example
     * client.eventEmmiter('event', Args)
     */
    eventEmmiter(event, ...args) {
        switch (event) {
            case 'message':
                var responseMessage = {
                    /**
                     * @returns {string} text content of message
                     */
                    toString: () => {
                        return args[0].params[1].toString();
                    },
                    /**
                     * @type {string} The string of context text of message
                     */
                    content: args[0].params[1].toString(),
                    /**
                     * responds the author of message
                     * @param {string} [message] the message than will be sended as reply of original message
                     * @return {promise<pending>} The message sended metadata
                     */
                    reply: (message) => {
                        return this.sleept.methods.sendMessage(args[0].params[0], `@${args[0].prefix.slice(0,args[0].prefix.indexOf('!'))} ${message}`);
                    },
                    channel: {
                        /**
                         * @type {string} the channel name without the hashtag
                         */
                        name: args[0].params[0].slice(0),
                        /**
                         * send a message on the same channel who send it
                         * @param {string} [message] the message than will be sended on the channel
                         * @return {promise<pending>} The message sended metadata
                         */
                        send: (...message) => {
                            return this.sleept.methods.sendMessage(args[0].params[0], message);
                        }
                    },
                    author: {
                        /**
                         * @type {string} the name of the sender of message (channelname without hashtag)
                         */
                        username: args[0].prefix.slice(0,args[0].prefix.indexOf('!')),
                        /**
                         * @type {string} the display name of the sender of message (can includes spaces symbols and captal letters)
                         */
                        displayName: args[0].tags['display-name'],
                        /**
                         * @type {boolean} if the sender of message is the bot itself
                         */
                        self: args[0].prefix.slice(0,args[0].prefix.indexOf('!')) === this.options.userName,
                        /**
                         * @type {string} id of author (on twitch? maybe)
                         */
                        id: args[0].tags.id,
                        /**
                         * @type {boolean} if the user who send the message have mod on that channel
                         */
                        mod: args[0].tags.mod === '1',
                        /**
                         * @type {boolean} if the user who send the message is subscribed on the channel
                         */
                        subscriber: args[0].tags.subscriber >= '1',
                        /**
                         * @type {boolean} if the user who send the message have Twitch turbo
                         */
                        turbo: args[0].tags.turbo >= '1',
                        /**
                         * @type {string} the id of user (on the chat? maybe)
                         */
                        userId: args[0].tags['user-id'],
                        /**
                         * @type {string} the user color on the chat (on hex)
                         */
                        color: args[0].tags.color,
                        /**
                         * @type {boolean} if the user have any badge on this channel
                         */
                        containsBadge: args[0].tags['badge-info'],
                        /**
                         * @type {string} all badges the user have in this channel (not parsed, maybe in future)
                         */
                        badges: args[0].tags.badges,
                        /**
                         * @type {boolean} if the user who send the message is the broadcaster
                         */
                        broadcaster: args[0].tags['badge-info'] ? args[0].tags.badges.includes('broadcaster') : false,
                    }
                };
                this.emit(event, responseMessage);
                break;
            default:
                this.emit(event, args);
                break;
        }
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