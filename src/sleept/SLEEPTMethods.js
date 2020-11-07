const { Constants, logger } = require('../utils');
// const Endpoints = Constants.Endpoints;

class SLEEPTMethods {
    constructor(sleeptMananger) {
        this.sleept = sleeptMananger;
        this.client = sleeptMananger.client;
        this._ackToken = null;
    }

    login(token = this.client.token) {
        return new Promise((resolve, reject) => {
            if (!token || typeof token !== 'string') logger.Fatal(Constants.Errors.INVALID_TOKEN);
        });
    }
    /**
     * @todo: Endpoints
     */
    /*
    logout() {
        return this.rest.makeRequest('post', Endpoints.logout, true, {});
    }
    */
}

module.exports = SLEEPTMethods;