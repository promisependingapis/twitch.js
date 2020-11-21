const WebSocket = require('ws');
const { Constants, logger } = require('../utils');
// const Endpoints = Constants.Endpoints;

class SLEEPTMethods {
    constructor(sleeptMananger) {
        this.sleept = sleeptMananger;
        this.client = sleeptMananger.client;
        this._ackToken = null;
    }

    login(token = this.client.token) {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
            if (!token || typeof token !== 'string' || !token.startsWith('oauth:') || token.includes(' ')) logger.Fatal(Constants.Errors.INVALID_TOKEN);
            this.UserName = global.TwitchApis.Client.Option.UserName;
            this.server = global.TwitchApis.Client.Option.http.host;
            this.ws = new WebSocket(`wss://${this.server}:443/`, 'irc');
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onerror = this.onError.bind(this);
            this.ws.onclose = this.onClose.bind(this);
            this.ws.onopen = this.onOpen.bind(this);
        });
    }

    onMessage() {
    }

    onError(event) {
        logger.Fatal(JSON.stringify(event.error));
    }

    onClose(event) {
        console.log(event);
    }

    onOpen(token = this.client.token) {
        if (this.ws.readyState !== 1) {
            return;
        }
        logger.Debug('Connection Started, Sending auth information...');
        this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
        this.ws.send(`PASS ${token}`);
        this.ws.send(`NICK ${this.UserName}`);
    }

    /**
     * @todo Endpoints;
     * @todo remove line 12 eslint disable next line;
     */
    /*
    logout() {
        return this.rest.makeRequest('post', Endpoints.logout, true, {});
    }
    */
}

module.exports = SLEEPTMethods;