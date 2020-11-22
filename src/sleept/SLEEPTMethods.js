/* eslint-disable indent */
const WebSocket = require('ws');
const { Constants, logger, Parser } = require('../utils');
// const Endpoints = Constants.Endpoints;

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
                reject(Constants.Errors.INVALID_TOKEN);
                logger.Fatal(Constants.Errors.INVALID_TOKEN); 
            }
            if (!UserName || typeof UserName !== 'string' || !UserName.includes(' ')) {
                reject(Constants.Errors.INVALID_USERNAME);
                logger.Fatal(Constants.Errors.INVALID_USERNAME);
            }
            this.client.token = token;
            this.UserName = UserName;
            this.server = global.TwitchApis.Client.Option.http.host;
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
        logger.Debug(this.MessageRawSplited);
        this.MessageRawSplited.forEach((str) => {
            if (str !== null) {
                this.HandlerMessage(Parser.Message(str));
            }
        });
    }

    onError(event) {
        logger.Fatal(JSON.stringify(event.error));
    }

    onClose() {
        logger.Debug('Conection finished ;-;');
    }

    onOpen() {
        var token = this.client.token;
        if (this.ws.readyState !== 1) {
            return;
        }
        this.ready = true;
        logger.Debug('Connection Started, Sending auth information...');
        this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
        logger.Debug('Sending Password...');
        this.ws.send(`PASS ${token}`);
        logger.Debug('Sending Nickname...');
        this.ws.send(`NICK ${this.UserName.toLowerCase()}`);
    }

    HandlerMessage(MessageObject) {
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
                    logger.Debug('Connected to the server');
                    this.pingLoop = setInterval(() => {
                        if (this.isConnected()) {
                            this.ws.send('PING');
                        }
                        this.latency = new Date();
                        this.pingTimeout = setTimeout(() => {
                            if (this.ws !== null) {
                                this.wasCloseCalled = false;
                                logger.Error('Ping timeout');
                                this.ws.close();

                                clearInterval(this.pingLoop);
                                clearTimeout(this.pingTimeout);
                            }
                        }, 9999);
                    }, 60000);
                    this.OnConnected();
            }
        }
    }

    OnConnected() {
        global.TwitchApis.Client.Option.Channels.forEach((element) => {
            this.ws.send('JOIN ' + element);
        });
    }
    /*
    logout() {
        return this.rest.makeRequest('post', Endpoints.logout, true, {});
    }
    */
}

module.exports = SLEEPTMethods;