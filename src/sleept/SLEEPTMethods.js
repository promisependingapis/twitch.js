/* eslint-disable indent */
const WebSocket = require('ws');
const { constants, logger, parser } = require('../utils');
// const Endpoints = constants.Endpoints;

/**
 * @todo Endpoints;
 * @todo remove line 18 eslint disable next line;
 * @todo Inprove case switch of MessageHandler if theres no prefix
 */

class SLEEPTMethods {
    constructor(sleeptMananger) {
        this.sleept = sleeptMananger;
        this.client = sleeptMananger.client;
        this._ackToken = null;
    }

    isConnected() {
        return this.ws !== null && this.ws.readyState === 1;
    }

    login(userName, token) {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
            if (!token || typeof token !== 'string' || !token.startsWith('oauth:') || token.includes(' ')) {
                reject(constants.errors.INVALID_TOKEN);
                logger.fatal(constants.errors.INVALID_TOKEN); 
            }
            if (!userName || typeof userName !== 'string' || userName.includes(' ')) {
                reject(constants.errors.INVALID_USERNAME);
                logger.fatal(constants.errors.INVALID_USERNAME);
            }
            this.client.token = token;
            this.userName = userName;
            this.server = global.twitchApis.client.option.http.host;
            this.ws = new WebSocket(`wss://${this.server}:443`);
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onerror = this.onError.bind(this);
            this.ws.onclose = this.onClose.bind(this);
            this.ws.onopen = this.onOpen.bind(this);
            resolve();
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
        logger.debug('Conection finished ;-;');
    }

    onOpen() {
        var token = this.client.token;
        if (this.ws.readyState !== 1) {
            return;
        }
        this.ready = true;
        logger.debug('Connection Started, Sending auth information...');
        this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
        logger.debug('Sending Password...');
        this.ws.send(`PASS ${token}`);
        logger.debug('Sending Nickname...');
        this.ws.send(`NICK ${this.userName.toLowerCase()}`);
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
                    if (!this.pingTimeout) {return;}
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
                    break;
                case '372': 
                    logger.debug('Connected to the server');
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
                default:
                    break;
            }
        } else if (messageObject.prefix === this.userName + '.tmi.twitch.tv') {
            switch (messageObject.command) {
                case '353':
                    this.client.eventEmmiter('Method.Joined.' + messageObject.params[2]);
                    this.client.eventEmmiter('join', messageObject.params[2]);
                    break;
                default:
                    break;
            }
        } else {
            switch (messageObject.command) {
                case 'PART':
                    this.client.eventEmmiter('Method.Leaved.' + messageObject.params[0]);
                    this.client.eventEmmiter('leave', messageObject.params[0]);
                    break;
                case 'PRIVMSG':
                    this.client.eventEmmiter('message', messageObject);
                    logger.debug(messageObject.params[0] + '| ' + messageObject.prefix.slice(0,messageObject.prefix.indexOf('!')) + ': ' + messageObject.params[1]);
                    break;
                default:
                    break;
            }
        }
    }

    onConnected() {
        // Once connected connect the user to the servers he parsed on client inicialization
        global.twitchApis.client.option.channels.forEach((element, index) => {
            setTimeout(()=>{
                this.join(element, index);
            }, index * 100);
        });
        this.client.eventEmmiter('ready', this.server, '443');
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
            this.ws.send(`JOIN ${channel.toLowerCase()}`);
            logger.debug('Connecting to: ' + channel.toLowerCase());
            this.client.on('Method.Joined.' + channel.toLowerCase(), listener);
            global.twitchApis.client.methods.joinQueueTimeout.push([setTimeout(()=> {
                reject('Couldn\'t connect with twitch');
            }, 10000), channel.toLowerCase()]);
            function listener() {
                logger.debug('Connected to: ' + channel.toLowerCase());
                global.twitchApis.client.methods.joinQueueTimeout.forEach((element) => {
                    if (element[1] === channel.toLowerCase()) {
                        clearTimeout(element[0]);
                        return;
                    }
                });
                this.removeListener('Method.Joined.' + channel.toLowerCase(), listener);
                resolve();
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
            this.ws.send(`PART ${channel.toLowerCase()}`);
            logger.debug('Disconnecting from: ' + channel.toLowerCase());
            this.client.on('Method.Leaved.' + channel.toLowerCase(), listener);
            global.twitchApis.client.methods.leaveQueueTimeout.push([setTimeout(()=> {
                logger.fatal('Couldn\'t connect with twitch');
                reject('Couldn\'t connect with twitch');
            }, 10000), channel.toLowerCase()]);
            function listener() {
                logger.debug('Disconnected from: ' + channel.toLowerCase());
                global.twitchApis.client.methods.leaveQueueTimeout.forEach((element) => {
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
            this.client.on('Method.Ping', () => listener);
            this.ws.send('PING');
            const pingTimeout = setTimeout(()=> {
                logger.fatal('Couldn\'t connect with twitch');
                reject('Couldn\'t connect with twitch');
            }, 20000);
            function listener() {
                this.removeListener('Method.Ping');
                clearTimeout(pingTimeout);
                logger.debug('Pong!');
                ping = new Date() - ping;
                resolve(ping);
            }
        });
    }

    sendMessage(channel, ...message) {
        return new Promise((resolve, reject) => {
            if (!message || message === null || (typeof message === 'object' && message[0] === null)) {
                logger.warn('Cannot send empty messages');
                reject('Cannot send empty messages');
            }
            message = message.join(' ');
            resolve(this.ws.send(`PRIVMSG ${channel} :${message}`));
        });
    }

    /*
    logout() {
        return this.rest.makeRequest('post', Endpoints.logout, true, {});
    }
    */
}

module.exports = SLEEPTMethods;