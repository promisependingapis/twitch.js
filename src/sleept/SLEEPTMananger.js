const path = require('path');
const UserAgentManager = require(path.resolve(__dirname,'UserAgentManager'));
const SLEEPTMethods = require(path.resolve(__dirname,'SLEEPTMethods'));
const SequentialRequestHandler = require(path.resolve(__dirname,'RequestHandlers','Sequential'));
const BurstRequestHandler = require(path.resolve(__dirname,'RequestHandlers','Burst'));
const { constants, logger: LoggerC } = require(path.resolve(__dirname,'..','utils'));
var logger;
/**
 * The manager for all things than envolve Sleept
 */
class SLEEPTMananger {
    constructor(client) {
        this.client = client;
        this.handlers = {};
        this.userAgentManager = new UserAgentManager(this);
        this.methods = new SLEEPTMethods(this);
        this.rateLimitedEndpoints = {};
        this.globallyRateLimited = false;
        logger = new LoggerC({debug: this.client.options.debug});
    }

    /**
     * Destroy all Sleept handlers
     */
    destroy() {
        for (const handlerKey of Object.keys(this.handlers)) {
            const handler = this.handlers[handlerKey];
            if (handler.destroy) handler.destroy();
        }
    }

    /**
     * push request to a handler
     * @param {} [handler] the handler who will receive the request
     * @param {} [apiRequest] the requrest who will be added to the handler
     * @return {Promise<Pending>} returned once the request is solved or rejected
     */
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

    /**
     * Gets a hequest handler
     * @return {'SequentialRequestHandler'|'BurstRequestHandler'}
     */
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
