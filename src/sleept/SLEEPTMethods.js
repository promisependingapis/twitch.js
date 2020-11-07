const { Constants, logger } = require('../utils')

class SLEEPTMethods {
    constructor(sleeptMananger) {
        this.sleept = sleeptMananger;
        this.client = sleeptMananger.client;
        this._ackToken = null;
    }

    login(token = this.client.token) {
        return new Promise((resolve, reject) => {
            if (!token || typeof token !== 'string') logger.fatal(Constants.Errors.INVALID_TOKEN);
        });
    }
}