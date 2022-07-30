"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const interfaces_1 = require("../interfaces/");
const managers_1 = require("./managers/");
const websocket_1 = require("./connection/websocket");
const utils_1 = require("../utils");
const rest_1 = require("./connection/rest");
const events_1 = __importDefault(require("events"));
class Client extends events_1.default {
    constructor(options) {
        super();
        this.isReady = false;
        this.readyAt = 0;
        this.currentStep = interfaces_1.ESteps.PRE_INIT;
        this.token = null;
        this.tokenVerified = false;
        this.stepManagerStarted = false;
        this.restManager = new rest_1.RestManager(this);
        this.wsManager = new websocket_1.WebSocketManager(this);
        this.users = new managers_1.UserManager(this);
        this.channels = new managers_1.ChannelManager(this);
        this.steps = {
            [interfaces_1.ESteps.PRE_INIT]: [
                () => __awaiter(this, void 0, void 0, function* () { yield this.setOptions(options); }),
                () => { this.logger.info('System is prepared, initializing...'); },
            ],
            [interfaces_1.ESteps.INIT]: [
                () => __awaiter(this, void 0, void 0, function* () { yield this.restManager.loadAllMethods(); }),
                () => __awaiter(this, void 0, void 0, function* () { yield this.wsManager.loadMethods(); }),
            ],
            [interfaces_1.ESteps.POST_INIT]: [
                () => __awaiter(this, void 0, void 0, function* () { yield utils_1.waiters.waitForToken.bind(this)(); }),
                () => __awaiter(this, void 0, void 0, function* () { yield this.wsManager.start(); }),
            ],
            [interfaces_1.ESteps.LOGIN]: [
                () => __awaiter(this, void 0, void 0, function* () { yield this.wsManager.login(this.token); }),
                () => __awaiter(this, void 0, void 0, function* () { yield utils_1.waiters.waitForTwitchConnection.bind(this)(); }),
            ],
            [interfaces_1.ESteps.READY]: [
                () => { this.readyAt = Date.now(); },
                () => { this.rawEmit('ready'); },
            ],
        };
    }
    addStepCommand(step, callback) {
        if (!this.steps[step.toString()]) {
            this.steps[step.toString()] = [];
        }
        this.steps[step.toString()].push(() => __awaiter(this, void 0, void 0, function* () { yield callback(); }));
    }
    start() {
        return this.stepManager();
    }
    login(token) {
        this.token = token;
        this.tokenVerified = true;
        this.stepManager();
    }
    /**
     * @description Set the client options
     * @param [options]: IClientOptions
     * @returns [boolean] - True if the options were set, false otherwise
     * @private
     */
    setOptions(options) {
        return new Promise((resolve) => {
            var _a;
            this.options = Object.assign(Object.assign({}, interfaces_1.defaultOptions), options);
            if (this.options.debug) {
                this.options.loggerOptions.debug = true;
            }
            if (this.options.prefix) {
                this.options.loggerOptions.prefix = this.options.prefix;
            }
            if (this.options.disableFatalCrash) {
                this.options.loggerOptions.disableFatalCrash = true;
            }
            this.logger = new utils_1.Logger(this.options.loggerOptions);
            this.logger.debug('Debug Mode Enabled!');
            if (this.options.autoLogEndEnabled) {
                utils_1.autoLogEnd.activate((_a = this.options.autoLogEndUncaughtException) !== null && _a !== void 0 ? _a : false);
                this.logger.debug('Auto Log End™ enabled');
                if (this.options.autoLogEndUncaughtException) {
                    this.logger.debug('Auto Log End™ will log uncaught exceptions');
                }
            }
            if (this.options.connectedChannels.length > 0) {
                this.logger.error('`ConnectedChannels` has been set, but it is a private parameter! Use the `Channels` property instead!');
                this.logger.warn('Changing the `ConnectedChannels` property values to the `Channels` automatically!');
                this.options.channels = [...this.options.channels, ...this.options.connectedChannels];
                this.options.connectedChannels = [];
            }
            if (this.options.fetchAllChatters) {
                this.logger.debug('Fetching all chatters is enabled!');
            }
            if (this.options.messageCacheLifetime > 0) {
                this.logger.debug('Message cache lifetime is set to ' + this.options.messageCacheLifetime + ' seconds');
            }
            if (this.options.messageCacheMaxSize > 0) {
                this.logger.debug('Message cache max size is set to ' + this.options.messageCacheMaxSize);
            }
            if (this.options.messageSweepInterval > 0) {
                this.logger.debug('Message sweep interval is set to ' + this.options.messageSweepInterval + ' seconds');
            }
            if (this.options.retryInterval > 0) {
                this.logger.debug('Retry interval is set to ' + this.options.retryInterval + ' seconds');
            }
            if (this.options.retryLimit > 0) {
                this.logger.debug('Retry limit is set to ' + this.options.retryLimit);
            }
            if (this.options.sync) {
                this.logger.debug('Synchronization is enabled!');
            }
            if (this.options.syncInterval > 0) {
                this.logger.debug('Synchronization interval is set to ' + this.options.syncInterval + ' seconds');
            }
            if (this.options.ws.host) {
                this.logger.debug('WebSocket host is set to ' + this.options.ws.host);
            }
            if (this.options.ws.port) {
                this.logger.debug('WebSocket port is set to ' + this.options.ws.port);
            }
            if (this.options.ws.type) {
                this.logger.debug('WebSocket type is set to ' + this.options.ws.type);
            }
            if (this.options.http.host) {
                this.logger.debug('HTTP host is set to ' + this.options.http.host);
            }
            if (this.options.http.hostID) {
                this.logger.debug('HTTP host ID is set to ' + this.options.http.hostID);
            }
            if (this.options.http.headers) {
                this.logger.debug('HTTP headers are set to ' + JSON.stringify(this.options.http.headers));
            }
            if (this.options.channels.length > 0) {
                this.logger.debug('Channels are set to ["' + this.options.channels.join('", "') + '"]');
            }
            this.logger.debug('Client options set!');
            resolve();
        });
    }
    /**
     * Returns the time bot is connected with twitch in milliseconds
     * @returns {Promise<number>}
     * @example
     * await Client.uptime()
     * @example
     * Client.uptime().then((time) => { })
     */
    uptime() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(Math.max((Date.now() - this.readyAt), 0));
        });
    }
    /**
     * @Override
     */
    emit(eventName, ...args) {
        this.getLogger().warn(`You are emitting an event as the client, this can lead to unexpected behaviors and its not recommend!\n
      We are still going to emit the event, but you should avoid it!`);
        return super.emit(eventName, ...args);
    }
    /**
     * @private
     */
    rawEmit(eventName, ...args) {
        return super.emit(eventName, ...args);
    }
    /**
     * @description Get the logger instance
     * @returns [Logger] - The logger instance
     * @public
     */
    getLogger() {
        return this.logger;
    }
    /**
     * @description Get the client options
     * @returns [IClientOptions] - The client options
     * @public
     */
    getOptions() {
        return this.options;
    }
    /**
     * @description Get the REST API Manager Instance
     * @returns [RestManager] - The REST API Manager Instance
     * @public
     */
    getRestManager() {
        return this.restManager;
    }
    /**
     * @description Get the WebSocket Manager Instance
     * @returns [WebSocketManager] - The WebSocket Manager Instance
     * @public
     */
    getWebSocketManager() {
        return this.wsManager;
    }
    /**
     * @private
     */
    setIsReady(isReady) {
        if (this.isReady)
            return;
        this.isReady = isReady;
    }
    setStep(step) {
        var _a;
        if (step !== this.currentStep) {
            ((_a = this.logger) !== null && _a !== void 0 ? _a : console).debug(`Step changed from ${this.currentStep} to ${step}`);
        }
        this.currentStep = step;
        this.rawEmit('client.changedStep', step);
        this.rawEmit('client.changedStepTo.' + step);
    }
    /**
     * @description Get the current client step
     * @returns [ESteps] - The current client step
     * @public
     */
    getCurrentStep() {
        return this.currentStep;
    }
    stepManager() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.stepManagerStarted)
                return;
            this.stepManagerStarted = true;
            for (const step in interfaces_1.ESteps) {
                this.setStep(step);
                if (this.steps[this.currentStep]) {
                    for (const stepFunction of this.steps[this.currentStep]) {
                        try {
                            // eslint-disable-next-line no-await-in-loop
                            yield stepFunction();
                        }
                        catch (error) {
                            this.logger.fatal(error);
                            return;
                        }
                    }
                }
            }
        });
    }
}
exports.Client = Client;
