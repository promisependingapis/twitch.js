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

    login(UserName, token) {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
            if (!token || typeof token !== 'string' || !token.startsWith('oauth:') || token.includes(' ')) {
                reject(constants.errors.INVALID_TOKEN);
                logger.fatal(constants.errors.INVALID_TOKEN); 
            }
            if (!UserName || typeof UserName !== 'string' || UserName.includes(' ')) {
                reject(constants.errors.INVALID_USERNAME);
                logger.fatal(constants.errors.INVALID_USERNAME);
            }
            this.client.token = token;
            this.UserName = UserName;
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
        this.ws.send(`NICK ${this.UserName.toLowerCase()}`);
    }

    handlerMessage(MessageObject) {
        if (MessageObject === null) {
            return;
        }

        // Message Without prefix
        if (MessageObject.prefix === null) {
            switch (MessageObject.command) {
                // Ping
                case 'PING':
                    this.ws.send('PONG');
                break;

                case 'PONG':
                    if (!this.pingTimeout) {return;}
                    clearTimeout(this.pingTimeout);
                break;

                default:
                break;
            }
        } else if (MessageObject.prefix === 'tmi.twitch.tv') {
            switch (MessageObject.command) {
                case '002':
                case '003':
                case '004':
                case '375':
                case '376':
                case 'CAP':
                break;

                case '001':
                    this.UserName = MessageObject.params[0];
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
        } else {
            switch (MessageObject.command) {
                case 'PRIVMSG':
                    logger.debug(MessageObject.params[0] + '| ' + MessageObject.prefix.slice(0,MessageObject.prefix.indexOf('!')) + ': ' + MessageObject.params[1]);
                break;
            }
        }
    }

    onConnected() {
        // Once connected connect the user to the servers he parsed on client inicialization
        global.twitchApis.client.option.channels.forEach((element, index) => {
            this.join(element, index);
        });
    }

    join(channel, index) {
        if (channel.includes(' ')) {
            return logger.error('Channel name cannot include spaces: ' + channel + (index ? ', on channels list index: ' + index : ''));
        }
        if (!channel.startsWith('#')) {
            channel = '#' + channel;
        }
        this.ws.send(`JOIN ${channel.toLowerCase()}`);
        logger.info('Entering on: ' + channel.toLowerCase());
    }

    leave(channel, index) {
        if (channel.includes(' ')) {
            return logger.error('Channel name cannot include spaces: ' + channel + (index ? ', on channels list index: ' + index : ''));
        }
        if (!channel.startsWith('#')) {
            channel = '#' + channel;
        }
        this.ws.send(`PART ${channel.toLowerCase()}`);
        logger.info('Exiting of: ' + channel.toLowerCase());
    }

    /*
    logout() {
        return this.rest.makeRequest('post', Endpoints.logout, true, {});
    }
    */
}

module.exports = SLEEPTMethods;