/* eslint-disable indent */
const path = require('path');
const WebSocket = require('ws');
const { constants, logger, parser } = require(path.resolve(__dirname,'..','utils'));
const { channels, users } = require(path.resolve(__dirname,'..','structures'));

/**
 * The main file. Connect with twitch websocket and provide access to irc.
 * @private
 */
class SLEEPTMethods {
    constructor(sleeptMananger) {
        const { getChatter } = require(path.resolve(__dirname,'api'));
        this.sleept = sleeptMananger;
        this.client = sleeptMananger.client;
        this._ackToken = null;
        this.getChatter = getChatter;
        this.connected = 0;
        this.isAnonymous = false;
        this.joinQueueTimeout = [];
        this.leaveQueueTimeout = [];
    }

    isConnected() {
        return this.ws !== null && this.ws.readyState === 1;
    }

    login(token) {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line max-len
            if ((typeof token !== 'string' && typeof token !== 'boolean') || (typeof token === 'string' && !token.startsWith('oauth:')) || (typeof token === 'string' && token.includes(' ')) || (typeof token === 'boolean' && token !== false)) {
                reject(constants.errors.INVALID_TOKEN);
                logger.fatal(constants.errors.INVALID_TOKEN);
            }
            if (token === false) {
                this.isAnonymous = true;
            } else {
                this.client.token = token;
                this.userName = 'twitchjs'; // Just to start the connection after that, twitch sends back the bot name and we replace it
                this.id = '';
            }
            this.server = this.client.options.http.host;
            this.ws = new WebSocket(`wss://${this.server}:443`);
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

    onMessage(event) {
        this.MessageRawSplited = event.data.toString().split('\r\n');
        this.MessageRawSplited.forEach((str) => {
            if (str !== null) {
                this.handlerMessage(parser.Message(str));
            }
        });
    }

    onError(event) {
        logger.fatal(JSON.stringify(event.error));
    }

    onClose() {
        if (this.connected || this.connected === 0) {
            logger.fatal('Conection finished ;-;');
            process.exit(1);
        } else {
            logger.info('Conection with IRC closed.');
        }
        this.client.eventEmmiter('_IRCDisconnect');
    }

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
            var token = this.client.token;
            logger.debug('Sending Password...');
            this.ws.send(`PASS ${token}`);
            logger.debug('Sending Nickname...');
            this.ws.send(`NICK ${this.userName.toLowerCase()}`);
        }
    }

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
                case 'ROOMSTATE':
                    var channel = this.client.channels.get(messageObject.params[0]);
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
                default:
                    break;
            }
        } else if (messageObject.prefix === this.userName + '.tmi.twitch.tv') {
            switch (messageObject.command) {
                default:
                    break;
            }
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

    onConnected() {
        // Once connected connect the user to the servers he parsed on client inicialization
        this.client.options.channels.forEach((element, index) => {
            setTimeout(() => {
                this.join(element, index);
            }, index * 100);
        });
        this.client.eventEmmiter('ready', this.server, '443');
        this.client.readyAt = Date.now();
        this.connected = true;
    }

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
            this.ws.send(`JOIN ${channel.toLowerCase()}`);
            logger.debug('Connecting to: ' + channel.toLowerCase());
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
            this.ws.send(`PART ${channel.toLowerCase()}`);
            logger.debug('Disconnecting from: ' + channel.toLowerCase());
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
    generateUser(channelName) {
        this.getChatter(channelName).then((Users) => {
            if (!this.client.channels.get(channelName)) {return;}
            Users.chatters.broadcaster.forEach((broadcaster) => {
            if (!this.client.channels.get(channelName).users.get(broadcaster)) {
                this.client.channels.get(channelName).users.set(broadcaster, 
                    new users(this.client, {userName: broadcaster,self: broadcaster === this.userName,broadcaster: true,}));
                }
            });
            Users.chatters.vips.forEach((vips) => {
                if (!this.client.channels.get(channelName).users.get(vips)) {
                    this.client.channels.get(channelName).users.set(vips, 
                    new users(this.client, {userName: vips,self: vips === this.userName,vip: true}));
                }
            });
            Users.chatters.moderators.forEach((moderators) => {
                if (!this.client.channels.get(channelName).users.get(moderators)) {
                    this.client.channels.get(channelName).users.set(moderators, 
                    new users(this.client, {userName: moderators,self: moderators === this.userName,mod: true}));
                }
            });
            Users.chatters.staff.forEach((staff) => {
                if (!this.client.channels.get(channelName).users.get(staff)) {
                    this.client.channels.get(channelName).users.set(staff, 
                    new users(this.client, {userName: staff,self: staff === this.userName,staff: true}));
                }
            });
            Users.chatters.admins.forEach((admins) => {
                if (!this.client.channels.get(channelName).users.get(admins)) {
                    this.client.channels.get(channelName).users.set(admins, 
                    new users(this.client, {userName: admins,self: admins === this.userName,admin: true}));
                }
            });
            Users.chatters.global_mods.forEach((global_mods) => {
                if (!this.client.channels.get(channelName).users.get(global_mods)) {
                    this.client.channels.get(channelName).users.set(global_mods, 
                    new users(this.client, {userName: global_mods,self: global_mods === this.userName,globalMod: true}));
                }
            });
            Users.chatters.viewers.forEach((viewers) => {
                if (!this.client.channels.get(channelName).users.get(viewers)) {
                    this.client.channels.get(channelName).users.set(viewers, 
                    new users(this.client, {userName: viewers,self: viewers === this.userName}));
                }
            });
        });
    }
    async updateUser(data) {
        if (data.prefix === 'tmi.twitch.tv') data.prefix = this.userName + '!';
        var user = this.client.channels.get(data.params[0]).users.get(data.prefix.slice(0, data.prefix.indexOf('!')));
        if (!user) {
            await this.client.channels.get(data.params[0]).users.set(data.prefix.slice(0, data.prefix.indexOf('!')), 
                new users(this, { userName: data.prefix.slice(0, data.prefix.indexOf('!'))})
            );
            user = this.client.channels.get(data.params[0]).users.get(data.prefix.slice(0, data.prefix.indexOf('!')));
        }
        user.haveBadges = data.tags['badge-info'] ? !!data.tags['badge-info'] : user.haveBadges;
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

    disconnect() {
        return new Promise((resolve, reject) => {
            if (this.ws && this.ws.readyState !== 3) {
                logger.warn('Disconnecting from IRC..');
                this.connected = false;
                this.ws.close();
                // eslint-disable-next-line no-inner-declarations
                function DisconnectionHandler() {
                    this.removeListener('_IRCDisconnect', DisconnectionHandler);
                    resolve([this.server, '443']);
                }
                this.client.on('_IRCDisconnect', DisconnectionHandler);
            }
            else {
                this.log.error('Cannot disconnect from IRC. Already disconnected.');
                reject('Cannot disconnect from IRC. Already disconnected.');
            }
        });
    }

    replyMessage(msgId, channel, message, replacer) {
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
}

module.exports = SLEEPTMethods;
