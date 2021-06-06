// eslint-disable-next-line strict
'use strict';
const path = require('path');
const WebSocket = require('ws');
const { constants, logger: LoggerC, parser } = require(path.resolve(__dirname,'..','utils'));
const { channels, users } = require(path.resolve(__dirname,'..','structures'));
const { getChatter, validator } = require(path.resolve(__dirname,'api'));
var logger;

const twitchUserRolesNameParser = {
    broadcaster: 'broadcaster',
    vips: 'vip',
    moderators: 'mod',
    staff: 'staff',
    admins: 'admin',
    global_mods: 'globalMod',
};

/**
 * The main file. Connect with twitch websocket and provide access to irc.
 * @private
 */
class SLEEPTMethods {
    constructor(sleeptMananger) {
        this.sleept = sleeptMananger;
        this.client = sleeptMananger.client;
        const chatter = new getChatter(this.client.options);
        const validate = new validator(this.client.options);
        this._ackToken = null;
        this.getChatter = chatter.getChattersInfo;
        this.validate = validate.validate;
        this.connected = 0;
        this.isAnonymous = false;
        this.joinQueueTimeout = [];
        this.leaveQueueTimeout = [];
        logger = new LoggerC({debug: this.client.options.debug});
    }

    /**
     * @returns {Boolean} if websocket is connected
     */
    isConnected() {
        return this.ws !== null && this.ws.readyState === 1;
    }

    /**
     * Connects with websocket and auth with IRC
     * @param {String} [token] the bot token
     * @param {Boolean} [false] Connect with IRC in anonymous mode
     * @returns {Promise<Pending>} when connected with IRC
     */
    login(token) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            // eslint-disable-next-line max-len
            if ((typeof token !== 'string' && typeof token !== 'boolean') || (typeof token === 'string' && !token.startsWith('oauth:')) || (typeof token === 'string' && token.includes(' ')) || (typeof token === 'boolean' && token !== false)) {
                reject(constants.errors.INVALID_TOKEN);
                logger.fatal(constants.errors.INVALID_TOKEN);
            }
            if (token === false) {
                this.isAnonymous = true;
            } else {
                this.client.token = token; 
            }
            if (!this.isAnonymous) {
                await this.validate(this.client.token).then((results) => {
                    this.client.clientId = results.client_id;
                    this.userName = results.login.toString();
                    this.id = results.user_id;
                    this.scopes = results.scopes;
                }).catch(() => {
                    reject(constants.errors.INVALID_TOKEN);
                    logger.fatal(constants.errors.INVALID_TOKEN);
                });
            }

            this.server = { host: this.client.options.ws.host, port: this.client.options.ws.port };

            this.ws = new WebSocket(this.client.options.ws.type + '://' + this.server.host + ':' + this.server.port);

            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onerror = this.onError.bind(this);
            this.ws.onclose = this.onClose.bind(this);
            this.ws.onopen = this.onOpen.bind(this);

            this.client.on('ready', resolver);

            function resolver() {
                this.removeListener('ready', resolver);
                resolve();
            }
        });
    }

    /**
     * Called every time a websocket message is received by IRC
     * @param {String} [event] the raw message event to be parsed
     */
    onMessage(event) {
        this.client.emit('Twitch.New.Websocket.Message', event);
        this.MessageRawSplited = event.data.toString().split('\r\n');
        this.MessageRawSplited.forEach((str) => {
            if (str !== null) {
                this.handlerMessage(parser.Message(str));
            }
        });
    }

    /**
     * Called when websocket went a error
     * @param {String} [event] the raw error object to be parsed
     */
    onError(event) {
        logger.error(event.message);
        logger.error('The above error is critic shutting down...');
        logger.fatal(JSON.stringify(event.error));
    }

    /**
     * Called when websocket connection close
     */
    onClose() {
        if (this.connected || this.connected === 0) {
            logger.fatal('Conection finished ;-;');
            process.exit(1);
        } else {
            logger.info('Conection with IRC closed.');
        }
        this.client.eventEmmiter('_IRCDisconnect');
    }

    /**
     * Called when websocket connection opens
     */
    onOpen() {
        if (this.ws.readyState !== 1) {
            return;
        }
        this.ready = true;
        logger.debug('Connection Started, Sending auth information...');
        this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
        if (this.isAnonymous) {
            logger.debug('Anonymous mode enabled');
            this.ws.send('PASS SCHMOOPIIE');
            this.ws.send(`NICK justinfan${Math.floor(1000 + Math.random() * 9000)}`);
        } else {
            const token = this.client.token;
            logger.debug('Sending Password...');
            this.ws.send(`PASS ${token}`);
            logger.debug('Sending Nickname...');
            this.ws.send(`NICK ${this.userName.toLowerCase()}`);
        }
    }

    /**
     * Called when websocket connection close
     * @param {Object} [messageObject] the object parsed by parser on onMessage
     */
    handlerMessage(messageObject) {
        if (messageObject === null) {
            return;
        }

        // Message Without prefix
        if (messageObject.prefix === null) {
            switch (messageObject.command) {
                // Ping
                case 'PING':
                    this.ws.send('PONG');
                    break;
                case 'PONG':
                    this.client.eventEmmiter('Method.Ping');
                    if (!this.pingTimeout) {
                        return;
                    }
                    clearTimeout(this.pingTimeout);
                    break;
                default:
                    break;
            }
            // Message with prefix tmi.twitch.tv
        } else if (messageObject.prefix === 'tmi.twitch.tv') {
            switch (messageObject.command) {
                case '002':
                case '003':
                case '004':
                case '375':
                case '376':
                case 'CAP':
                    break;
                case '001':
                    this.userName = messageObject.params[0];
                    this.client.user = {name: messageObject.params[0]};
                    break;
                case '372':
                    logger.debug('Connected to the server');
                    this.readyAt = Date.now();
                    this.client.options.readyAt = this.readyAt;
                    this.onConnected();
                    this.pingLoop = setInterval(() => {
                        if (this.isConnected()) {
                            this.ws.send('PING');
                        }
                        this.latency = new Date();
                        this.pingTimeout = setTimeout(() => {
                            if (this.ws !== null) {
                                this.wasCloseCalled = false;
                                logger.error('Ping timeout');
                                this.ws.close();

                                clearInterval(this.pingLoop);
                                clearTimeout(this.pingTimeout);
                            }
                        }, 9999);
                    }, 60000);
                    break;
                case '421':
                    logger.warn(
                        'Twitch return 421 code, an unknow command has been send to there, ' + 
                        'if it hasn\'t you, messing arround sendind raw messages to websocket, please leave a issue on github, it will be apreciated'
                    );
                    break;
                case 'ROOMSTATE':
                    // eslint-disable-next-line no-case-declarations
                    const channel = this.client.channels.get(messageObject.params[0]);
                    channel.emoteOnly = messageObject.tags['emote-only'] ? Number(messageObject.tags['emote-only']) === 1 : channel.emoteOnly;
                    channel.followersOnly = messageObject.tags['followers-only'] ? Number(messageObject.tags['followers-only']) >= 0 : channel.followersOnly;
                    channel.followersOnlyCooldown = messageObject.tags['followers-only']
                        ? Number(messageObject.tags['followers-only'])
                        : channel.followersOnlyCooldown;
                    channel.r9k = messageObject.tags.r9k ? Number(messageObject.tags.r9k) === 1 : channel.r9k;
                    channel.rituals = messageObject.tags.rituals ? Number(messageObject.tags.rituals) === 1 : channel.rituals;
                    channel.id = messageObject.tags['room-id'] ? messageObject.tags['room-id'] : channel.id;
                    channel.slowMode = messageObject.tags.slow ? Number(messageObject.tags.slow) >= 1 : channel.slowMode;
                    channel.slowCooldown = messageObject.tags.slow ? Number(messageObject.tags.slow) : channel.slowCooldown;
                    channel.subsOnly = messageObject.tags['subs-only'] ? Number(messageObject.tags['subs-only']) === 1 : channel.subsOnly;
                    break;
                case 'USERSTATE':
                    this.updateUser(messageObject);
                    break;
                case 'GLOBALUSERSTATE':
                    this.id = messageObject.tags['user-id'];
                    break;
                case 'CLEARCHAT':
                    // eslint-disable-next-line no-case-declarations
                    const TheChannel = this.client.channels.get(messageObject.params[0]);
                    if (messageObject.params[1]) {
                        const user = TheChannel.users.get(messageObject.params[1].replace(/:/g, ''));
                        this.client.emit('userClear', {channel: TheChannel, user});
                    } else {
                        this.client.emit('clearChat', TheChannel);
                    }
                    break; 
                default:
                    break;
            }
            // Message with prefix username.tmi.twitch.tv
        } else if (messageObject.prefix === this.userName + '.tmi.twitch.tv') {
            switch (messageObject.command) {
                default:
                    break;
            }
            // Message with prefix don't match with anything above
        } else {
            switch (messageObject.command) {
                case 'JOIN':
                    this.client.eventEmmiter('Method.Joined.' + messageObject.params[0]);
                    this.client.eventEmmiter('join', this.client.channels.get(messageObject.params[0]));
                    this.generateUser(messageObject.params[0]);
                    break;
                case 'PART':
                    if (this.client.channels.get(messageObject.params[0]).users.get(messageObject.prefix.slice(0, messageObject.prefix.indexOf('!')))) {
                        this.client.channels
                            .get(messageObject.params[0])
                            .users.delete(messageObject.prefix.slice(0, messageObject.prefix.indexOf('!')));
                    }
                    this.client.eventEmmiter('Method.Leaved.' + messageObject.params[0]);
                    this.client.eventEmmiter('leave', messageObject.params[0]);
                    break;
                case 'PRIVMSG':
                    this.updateUser(messageObject);
                    this.client.eventEmmiter('message', messageObject);
                    logger.debug(messageObject.params[0] + '| ' + messageObject.prefix.slice(0, messageObject.prefix.indexOf('!')) + ': ' + messageObject.params[1]);
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Called after websocket successfully connect with IRC and be on ready state
     */
    async onConnected() {
        // Once connected connect the user to the servers he parsed on client inicialization
        const promises = [];


        this.client.options.channels.forEach((element, index) => {
            promises.push(new Promise((resolve) => {
                setTimeout(async () => {
                    resolve(await this.join(element, index));
                }, index * 100);
            }));
        });

        await Promise.all(promises);
        
        this.client.eventEmmiter('ready', this.server.host, this.server.port);
        this.client.readyAt = Date.now();
        this.connected = true;
    }

    /**
     * Connects with a twitch channel chat
     * @param {String} [channel] the channel name who will be connected
     * @param {Number=} [index] the index of channels list of element
     * @return {Promise<Pending>} Resolved when sucessfull connect with channel
     */
    join(channel, index) {
        return new Promise((resolve, reject) => {
            if (channel.includes(' ')) {
                logger.error('Channel name cannot include spaces: ' + channel + (index ? ', on channels list index: ' + index : ''));
                return reject('Channel name cannot include spaces: ' + channel + (index ? ', on channels list index: ' + index : ''));
            }
            if (!channel.startsWith('#')) {
                channel = '#' + channel;
            }
            if (this.client.channels.get(channel) && this.client.channels.get(channel).connected === true) {
                logger.warn('Already connected with this channel!');
                return reject('Already connected with this channel!');
            }
            logger.debug('Connecting to: ' + channel.toLowerCase());
            this.ws.send(`JOIN ${channel.toLowerCase()}`);
            this.client.on('Method.Joined.' + channel.toLowerCase(), listener);
            this.joinQueueTimeout.push([
                setTimeout(() => {
                    reject('Couldn\'t connect with twitch');
                }, 10000),
                channel.toLowerCase(),
            ]);
            function listener() {
                logger.debug('Connected to: ' + channel.toLowerCase());
                if (!this.channels.get(channel)) {
                    this.channels.set(channel, new channels(this, { channel: channel }));
                }
                this.channels.get(channel).connected = true;
                this.sleept.methods.joinQueueTimeout.forEach((element) => {
                    if (element[1] === channel.toLowerCase()) {
                        clearTimeout(element[0]);
                        return;
                    }
                });
                this.removeListener('Method.Joined.' + channel.toLowerCase(), listener);
                resolve(channel);
            }
        });
    }

    /**
     * Leave from a twitch channel chat
     * @param {String} [channel] the channel name who will be leaved
     * @return {Promise<Pending>} Resolved when sucessfull leave of the channel
     */
    leave(channel) {
        return new Promise((resolve, reject) => {
            if (channel.includes(' ')) {
                logger.error('Channel name cannot include spaces: ' + channel);
                return reject('Channel name cannot include spaces: ' + channel);
            }
            if (!channel.startsWith('#')) {
                channel = '#' + channel;
            }
            if (this.client.channels.get(channel.toLowerCase()) && !this.client.channels.get(channel.toLowerCase()).isConnected()) {
                logger.error('Already not connected to the channel: ' + channel);
                return reject('Already not connected to the channel: ' + channel);
            }
            logger.debug('Disconnecting from: ' + channel.toLowerCase());
            this.ws.send(`PART ${channel.toLowerCase()}`);
            this.client.on('Method.Leaved.' + channel.toLowerCase(), listener);
            this.leaveQueueTimeout.push([
                setTimeout(() => {
                    logger.fatal('Couldn\'t connect with twitch');
                    reject('Couldn\'t connect with twitch');
                }, 10000),
                channel.toLowerCase(),
            ]);
            function listener() {
                logger.debug('Disconnected from: ' + channel.toLowerCase());
                if (this.channels.get(channel.toLowerCase()) && this.channels.get(channel.toLowerCase()).isConnected()) {
                    this.channels.delete(channel.toLowerCase());
                }
                this.sleept.methods.leaveQueueTimeout.forEach((element) => {
                    if (element[1] === channel.toLowerCase()) {
                        clearTimeout(element[0]);
                        return;
                    }
                });
                this.removeListener('Method.Leaved.' + channel.toLowerCase(), listener);
                resolve();
            }
        });
    }

    /**
     * Send a ping message to websocket
     * @return {Promise<Number>} The ping in milliseconds with IRC
     */
    ping() {
        return new Promise((resolve, reject) => {
            var ping = new Date();
            this.client.on('Method.Ping', listener);
            this.ws.send('PING');
            const pingCommandTimeout = setTimeout(() => {
                logger.fatal('Couldn\'t connect with twitch');
                reject('Couldn\'t connect with twitch');
            }, 20000);
            function listener() {
                this.removeListener('Method.Ping', listener);
                clearTimeout(pingCommandTimeout);
                logger.debug('Pong!');
                ping = new Date() - ping;
                return resolve(ping);
            }
        });
    }

    /**
     * Send a message to channel
     * @param {String} [channel] The channel name where the message will be delivered
     * @param {String} [message] The message content who will be sended 
     * @param {Array} [replacer] The replacements for %s on message content
     * @return {Promise<Pending>} returns when the message is sended
     */
    sendMessage(channel, message, ...replacer) {
        return new Promise((resolve, reject) => {
            if (typeof channel !== 'string') {
                logger.warn('The channel must be a String');
                return reject('The channel must be a String');
            } else if (typeof message !== 'string') {
                logger.warn('The message must be a String');
                return reject('The message must be a String');
            } else if (!message || message === null) {
                logger.warn('Cannot send empty messages');
                return reject('Cannot send empty messages');
            } else if (this.isAnonymous) {
                logger.warn('Cannot send messages in anonymous mode!');
                return reject('Cannot send messages in anonymous mode!');
            }
            if (replacer && replacer[0]) {
                replacer.forEach((element) => {
                    message = message.replace('%s', element);
                });
            }
            if (!channel.includes('#')) {
                channel = '#' + channel;
            }
            resolve(this.ws.send(`PRIVMSG ${channel} :${message}`));
        });
    }

    /**
     * Generate users collections and added it to channel user collection
     * @param {String} [channelName] The name of the channel to search for users
     */
    generateUser(channelName) {
        this.getChatter(channelName).then((Users) => {
            if (!this.client.channels.get(channelName)) {return;}
            Object.keys(Users.chatters).forEach((type) => {
                Users.chatters[type].forEach(async (User) => {
                    if (!this.client.channels.get(channelName).users.get(User)) {
                        await this.client.channels.get(channelName).users.set(User, 
                            new users(this.client, {userName: User,self: User === this.userName, channel: this.client.channels.get(channelName)}));
                        // Add adictional infomartion
                        this.client.channels.get(channelName).users.get(User)[twitchUserRolesNameParser[type]] = true;
                    }
                });
            });
        });
    }

    /**
     * Updates a user collection with the new data
     * @param {Object} [data] The messageObject returned from twitch with a user data
     */
    async updateUser(data) {
        if (data.prefix === 'tmi.twitch.tv') data.prefix = this.userName + '!';
        var user;
        user = this.client.channels.get(data.params[0]).users.get(data.prefix.slice(0, data.prefix.indexOf('!')));
        if (!user) {
            await this.client.channels.get(data.params[0]).users.set(data.prefix.slice(0, data.prefix.indexOf('!')), 
                new users(this, { userName: data.prefix.slice(0, data.prefix.indexOf('!')), channel: this.client.channels.get(data.params[0])})
            );
            user = this.client.channels.get(data.params[0]).users.get(data.prefix.slice(0, data.prefix.indexOf('!')));
        }
        user.haveBadges = data.tags['badge-info'] ? Boolean(data.tags['badge-info']) : user.haveBadges;
        user.badges = data.tags.badges ? data.tags.badges : user.badges;
        user.color = data.tags.color ? data.tags.color : user.color;
        user.displayName = data.tags['display-name'] ? data.tags['display-name'] : user.displayName;
        user.hasFlags = data.tags.flags ? data.tags.flags : user.hasFlags;
        user.mod = data.tags.mod ? Number(data.tags.mod) >= 1 : user.mod;
        user.subscriber = data.tags.subscriber ? Number(data.tags.subscriber) >= 1 : user.subscriber;
        user.turbo = data.tags.turbo ? data.tags.turbo >= 1 : user.turbo;
        user.userType = data.tags['user-type'] ? data.tags['user-type'] : user.userType;
        user.self = user.userName === this.userName;
        user.broadcaster = user.badges.toString().includes('broadcaster');
        user.id = user.self ? this.id : data.tags['user-id'] ? data.tags['user-id'] : user.id;
    }

    /**
     * Disconnect from IRC
     * @return {Promise<Pending>} returns when IRC sucessfull disconnect
     */
    disconnect() {
        return new Promise((resolve, reject) => {
            if (this.ws && this.ws.readyState !== 3) {
                logger.warn('Disconnecting from IRC..');
                logger.warn('Leaving all channels..');
                this.client.channels.map(channel => {
                    return this.leave(channel.name);
                });
                logger.warn('Disconnecting IRC..');
                this.connected = false;
                this.ws.close();
                clearInterval(this.pingLoop);
                clearTimeout(this.pingTimeout);
                const server = this.server;
                // eslint-disable-next-line no-inner-declarations
                function DisconnectionHandler() {
                    this.removeListener('_IRCDisconnect', DisconnectionHandler);
                    resolve([server.host, server.port]);
                }
                this.client.on('_IRCDisconnect', DisconnectionHandler);
            }
            else {
                this.log.error('Cannot disconnect from IRC. Already disconnected.');
                reject('Cannot disconnect from IRC. Already disconnected.');
            }
        });
    }

    /**
     * Reply a message sended on channel
     * @param {String} [msgId] The id of the message who will be responded
     * @param {String} [channel] The channel name where the message will be delivered
     * @param {String} [message] The message content who will be sended 
     * @param {Array} [replacer] The replacements for %s on message content
     * @return {Promise<Pending>} returns when the message is sended
     */
    replyMessage(msgId, channel, message, ...replacer) {
        return new Promise((resolve, reject) => {
            if (typeof channel !== 'string') {
                logger.warn('The channel must be a String');
                return reject('The channel must be a String');
            } else if (typeof message !== 'string') {
                logger.warn('The message must be a String');
                return reject('The message must be a String');
            } else if (!message || message === null) {
                logger.warn('Cannot send empty messages');
                return reject('Cannot send empty messages');
            } else if (!msgId || typeof msgId !== 'string') {
                logger.warn('The id of message than will be replied must be a string');
                return reject('The id of message than will be replied must be a string');
            } else if (this.isAnonymous) {
                logger.warn('Cannot send messages in anonymous mode!');
                return reject('Cannot send messages in anonymous mode!');
            }

            if (replacer && replacer[0]) {
                replacer.forEach((element) => {
                    message = message.replace('%s', element);
                });
            }
            if (!channel.includes('#')) {
                channel = '#' + channel;
            }
            resolve(this.ws.send(`@reply-parent-msg-id=${msgId} PRIVMSG ${channel} :${message}`));
        });
    }

    /**
     * @param {String} rawMessage a string with a websocket message to be sended to twitchIRC
     * @return {Promise<Any>} the websocket return of the message
     */
    sendRawMessage(rawMessage) {
        return new Promise((resolve) => {
            this.ws.send(rawMessage);
            const rawMessageCooldown = setTimeout(() => {
                this.client.removeListener('Twitch.New.Websocket.Message', twitchBrandNewResponse);
                resolve('No response from twitch ;-;');
            }, 10000);
            function twitchBrandNewResponse(data) {
                data = data.data;
                const commandData = rawMessage.split(' ');
                if (data.includes(commandData[0])) {
                    this.removeListener('Twitch.New.Websocket.Message', twitchBrandNewResponse);
                    clearTimeout(rawMessageCooldown);
                    resolve(data);
                }
            }
            this.client.on('Twitch.New.Websocket.Message', twitchBrandNewResponse);
        });
    }
}

module.exports = SLEEPTMethods;
