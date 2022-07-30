import { IClientOptions, defaultOptions, ESteps } from '../interfaces/';
import { ChannelManager, UserManager } from './managers/';
import { WebSocketManager } from './connection/websocket';
import { Logger, autoLogEnd, waiters } from '../utils';
import { RestManager } from './connection/rest';
import { UserStructure } from '../structures';
import EventEmitter from 'events';

export class Client extends EventEmitter {
  public channels: ChannelManager;
  public users: UserManager;
  public user: UserStructure;

  private steps: { [key: string]: Array<any> };
  private stepManagerStarted: boolean;
  private wsManager: WebSocketManager;
  private restManager: RestManager;
  private options: IClientOptions;
  private tokenVerified: boolean;
  private currentStep: ESteps;
  private isReady = false;
  private logger: Logger;
  private token: string;
  private readyAt = 0;

  constructor(options: IClientOptions) {
    super();

    this.currentStep = ESteps.PRE_INIT;
    this.token = null;
    this.tokenVerified = false;
    this.stepManagerStarted = false;
    this.restManager = new RestManager(this);
    this.wsManager = new WebSocketManager(this);

    this.users = new UserManager(this);
    this.channels = new ChannelManager(this);

    this.steps = {
      [ESteps.PRE_INIT]: [
        async (): Promise<void> => { await this.setOptions(options); },
        (): void => { this.logger.info('System is prepared, initializing...'); },
      ],
      [ESteps.INIT]: [
        async (): Promise<void> => { await this.restManager.loadAllMethods(); },
        async (): Promise<void> => { await this.wsManager.loadMethods(); },
      ],
      [ESteps.POST_INIT]: [
        async (): Promise<void> => { await waiters.waitForToken.bind(this)(); },
        async (): Promise<void> => { await this.wsManager.start(); },
      ],
      [ESteps.LOGIN]: [
        async (): Promise<void> => { await this.wsManager.login(this.token); },
        async (): Promise<void> => { await waiters.waitForTwitchConnection.bind(this)(); },
      ],
      [ESteps.READY]: [
        ():void => { this.readyAt = Date.now(); },
        ():void => { this.rawEmit('ready'); },
      ],
    };
  }

  public addStepCommand(step: ESteps, callback: () => void): void {
    if (!this.steps[step.toString()]) {
      this.steps[step.toString()] = [];
    }
    this.steps[step.toString()].push(async () => { await callback(); });
  }

  public start(): Promise<void> {
    return this.stepManager();
  }

  public login(token?: string): void {
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
  private setOptions(options: IClientOptions): Promise<void> {
    return new Promise((resolve) => {
      this.options = { ...defaultOptions, ...options };

      if (this.options.debug) {
        this.options.loggerOptions.debug = true;
      }

      if (this.options.prefix) {
        this.options.loggerOptions.prefix = this.options.prefix;
      }

      if (this.options.disableFatalCrash) {
        this.options.loggerOptions.disableFatalCrash = true;
      }

      this.logger = new Logger(this.options.loggerOptions);

      this.logger.debug('Debug Mode Enabled!');

      if (this.options.autoLogEndEnabled) {
        autoLogEnd.activate(this.options.autoLogEndUncaughtException ?? false);
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
  public async uptime(): Promise<number> {
    return Promise.resolve(Math.max((Date.now() - this.readyAt), 0));
  }

  /**
   * @Override
   */
  public emit(eventName: string | symbol, ...args: any[]): boolean {
    this.getLogger().warn(`You are emitting an event as the client, this can lead to unexpected behaviors and its not recommend!\n
      We are still going to emit the event, but you should avoid it!`);
    return super.emit(eventName, ...args);
  }

  /**
   * @private
   */
  public rawEmit(eventName: string | symbol, ...args: any[]): boolean {
    return super.emit(eventName, ...args);
  }

  /**
   * @description Get the logger instance
   * @returns [Logger] - The logger instance
   * @public
   */
  public getLogger(): Logger {
    return this.logger;
  }

  /**
   * @description Get the client options
   * @returns [IClientOptions] - The client options
   * @public
   */
  public getOptions(): IClientOptions {
    return this.options;
  }

  /**
   * @description Get the REST API Manager Instance
   * @returns [RestManager] - The REST API Manager Instance
   * @public
   */
  public getRestManager(): RestManager {
    return this.restManager;
  }

  /**
   * @description Get the WebSocket Manager Instance
   * @returns [WebSocketManager] - The WebSocket Manager Instance
   * @public
   */
  public getWebSocketManager(): WebSocketManager {
    return this.wsManager;
  }

  /**
   * @private
   */
  public setIsReady(isReady: boolean): void {
    if (this.isReady) return;
    this.isReady = isReady;
  }

  private setStep(step: ESteps): void {
    if (step !== this.currentStep) {
      (this.logger ?? console).debug(`Step changed from ${this.currentStep} to ${step}`);
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
  public getCurrentStep(): ESteps {
    return this.currentStep;
  }

  private async stepManager(): Promise<void> {
    if (this.stepManagerStarted) return;
    this.stepManagerStarted = true;
    for (const step in ESteps) {
      this.setStep(step as unknown as ESteps);
      if (this.steps[this.currentStep]) {
        for (const stepFunction of this.steps[this.currentStep]) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await stepFunction();
          } catch (error) {
            this.logger.fatal(error);
            return;
          }
        }
      }
    }
  }
}
