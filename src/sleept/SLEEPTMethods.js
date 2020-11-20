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
        });
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