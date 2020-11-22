const UserAgentManager = require('./UserAgentManager');
const SLEEPTMethods = require('./SLEEPTMethods');
const SequentialRequestHandler = require('./RequestHandlers/Sequential');
const BurstRequestHandler = require('./RequestHandlers/Burst');
const { constants, logger } = require('../utils');

class SLEEPTMananger {
    constructor(client) {
        this.client = client;
        this.handlers = {};
        this.userAgentManager = new UserAgentManager(this);
        this.methods = new SLEEPTMethods(this);
        this.rateLimitedEndpoints = {};
        this.globallyRateLimited = false;
    }

    destroy() {
        for (const handlerKey of Object.keys(this.handlers)) {
            const handler = this.handlers[handlerKey];
            if (handler.destroy) handler.destroy();
        }
    }

    push(handler, apiRequest) {
        return new Promise((resolve, reject) => {
            handler.push({
                request: apiRequest,
                resolve,
                reject,
                retries: 0,
            });
        });
    }

    getRequestHandler() {
        switch (this.client.options.apiRequestMethod) {
            case 'sequential':
                return SequentialRequestHandler;
            case 'burst':
                return BurstRequestHandler;
            default:
                logger.fatal(constants.Errors.INVALID_RATE_LIMIT_METHOD);
        }
    }
}

module.exports = SLEEPTMananger;