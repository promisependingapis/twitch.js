import { IClientOptions, defaultOptions, ESteps } from '../interfaces/';
import { ChannelManager, UserManager } from './managers/';
import { WebSocketManager } from './connection/websocket';
import { Logger, waiters } from '../utils';
import { RestManager } from './connection/rest';
import { BasicUserStructure, ChannelStructure } from '../structures';
import EventEmitter from 'events';
import logOptions from '../utils/logOptions';

export class Client extends EventEmitter {
  public channels: ChannelManager;
  public user: BasicUserStructure;

  /**
   * @private
   */
  public userManager: UserManager;
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
  resolveRunningStep: () => any;

  constructor(options: IClientOptions) {
    super();

    this.currentStep = ESteps.PRE_INIT;
    this.token = null;
    this.tokenVerified = false;
    this.stepManagerStarted = false;
    this.restManager = new RestManager(this);
    this.wsManager = new WebSocketManager(this);

    this.userManager = new UserManager(this);
    this.channels = new ChannelManager(this);

    this.resolveRunningStep = (): any => null;

    this.steps = {
      [ESteps.PRE_INIT]: [
        async (): Promise<void> => { await this.setOptions(options); },
        async (): Promise<void> => { await this.restManager.loadAllMethods(); },
        async (): Promise<void> => { await this.wsManager.loadMethods(); },
        (): void => { this.logger.debug('System is prepared, initializing...'); },
      ],
      [ESteps.INIT]: [
        async (): Promise<void> => { await waiters.waitForToken.bind(this)(); },
      ],
      [ESteps.POST_INIT]: [
        async (): Promise<void> => { await this.wsManager.start(); },
      ],
      [ESteps.LOGIN]: [
        async (): Promise<void> => { await this.wsManager.login(this.token); },
        async (): Promise<void> => { await waiters.waitForTwitchConnection.bind(this)(); },
      ],
      [ESteps.POST_LOGIN]: [
        async (): Promise<void> => { await this.multiJoin(this.options.channels); },
      ],
      [ESteps.READY]: [
        ():void => { this.readyAt = Date.now(); },
        ():void => { this.rawEmit('ready', this.options.ws.host, this.options.ws.port); },
      ],
      [ESteps.RUNNING]: [
        async (): Promise<void> => { return new Promise((resolve) => { this.resolveRunningStep = resolve; }); },
      ],
      [ESteps.STOPPING]: [
        async (): Promise<void> => { await this.wsManager.disconnect(); },
      ],
      [ESteps.STOPPED]: [
        (): void => { this.logger.debug('GoodBye! Hope to see you again. 😊'); },
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
    return new Promise((resolve) => {
      this.stepManager();
      this.on('client.changedStepTo.INIT', () => {
        return resolve();
      });
    });
  }

  public login(token?: string): Promise<void> {
    return new Promise((resolve) => {
      this.token = token;
      this.tokenVerified = true;
      this.stepManager();
      this.on('client.changedStepTo.POST_LOGIN', () => {
        return resolve();
      });
    });
  }

  /**
   * @description Set the client options
   * @param [options]: IClientOptions
   * @returns {Promise<void>}
   * @private
   */
  private setOptions(options: IClientOptions): Promise<void> {
    return new Promise(async (resolve) => {
      const [modifiedOptions, logger] = await logOptions(defaultOptions, options);
      this.options = modifiedOptions;
      this.logger = logger;
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
   * @description returns the client uptime in milliseconds
   * @returns {number} the number of milliseconds since the client is ready
   * @example
   * const uptime = Client.uptime();
   **/
  public uptimeSync(): number {
    return Math.max((Date.now() - this.readyAt), 0);
  }

  public async ping(): Promise<number> {
    const currentTimestamp = Date.now();
    await this.wsManager.ping();
    return Promise.resolve(Date.now() - currentTimestamp);
  }

  /**
   * Connects with a twitch channel chat
   * @param {string} [channel] the channel name who will be connected
   * @return {Promise<string>} Resolved when successfully connect with channel
   */
  public async join(channel: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (channel.includes(' ')) {
        this.logger.error('Channel name cannot include spaces: ' + channel);
        return reject('Channel name cannot include spaces: ' + channel);
      }

      if (!channel.startsWith('#')) {
        channel = '#' + channel;
      }

      if (this.channels.get(channel) && this.channels.get(channel).connected === true) {
        this.logger.warn('Already connected with this channel!');
        return reject('Already connected with this channel!');
      }

      this.logger.debug('Connecting to: ' + channel.toLowerCase());
      this.wsManager.getConnection().send(`JOIN ${channel.toLowerCase()}`);

      const timeout = setTimeout(() => {
        this.logger.error('Timeout while connecting to channel: ' + channel);
        return reject('Timeout while connecting to channel: ' + channel);
      }, 10000);

      this.on('join', (joinedChannel: ChannelStructure) => {
        if ('#' + joinedChannel.name === channel) {
          clearTimeout(timeout);
          return resolve(channel);
        }
      });
    });
  }

  /**
   * Connects in multiples twitch channels chats
   * @param {Array<string>} [channels] the array of channels to join
   * @return {Promise<string>} Resolved when successfully connect with channel
   */
  public async multiJoin(channels: string[]): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (channels.length === 0) {
        this.logger.error('No channels to join!');
        return reject('No channels to join!');
      }

      this.logger.debug('Connecting to: ' + channels.join(', ').toLowerCase());

      channels.forEach((channel, index) => {
        if (channel.includes(' ')) {
          this.logger.error('Channel name cannot include spaces: ' + channel);
          return reject('Channel name cannot include spaces: ' + channel);
        }

        if (!channel.startsWith('#')) {
          channels[index] = '#' + channel;
        }
      });

      this.wsManager.getConnection().send(`JOIN ${channels.join(',').toLowerCase()}`);

      const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

      channels.forEach((channel) => {
        timeouts.set(channel, setTimeout(() => {
          this.logger.error('Timeout while connecting to channel: ' + channel);
          channels.splice(channels.indexOf('#' + channel), 1);
          timeouts.delete('#' + channel);
          return reject('Timeout while connecting to channel: ' + channel);
        }, 10000));
      });

      this.on('join', (joinedChannel: ChannelStructure) => {
        if (channels.includes('#' + joinedChannel.name)) {
          clearTimeout(timeouts.get('#' + joinedChannel.name));
          channels.splice(channels.indexOf('#' + joinedChannel.name), 1);
          timeouts.delete('#' + joinedChannel.name);
        }

        if (channels.length === 0) {
          return resolve(channels.join(', ').toLowerCase());
        }
      });
    });
  }

  public async leave(channel: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (channel.includes(' ')) {
        this.logger.error('Channel name cannot include spaces: ' + channel);
        return reject('Channel name cannot include spaces: ' + channel);
      }
      if (!channel.startsWith('#')) {
        channel = '#' + channel;
      }
      if (this.user.username === channel) return reject('You can\'t leave your own channel');
      this.logger.debug(`Leaving channel ${channel}`);
      if (this.channels.get(channel) && this.channels.get(channel).connected === false) {
        this.logger.warn(`Already disconnected with ${channel} channel!`);
        return reject(`Already disconnected with ${channel} channel!`);
      }
      this.logger.debug('Disconnecting from: ' + channel.toLowerCase());
      this.wsManager.getConnection().send(`PART ${channel.toLowerCase()}`);
      this.on('leave', (channel: ChannelStructure) => {
        if (channel.name) {
          resolve(channel.name);
        }
      });
    });
  }

  public async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      this.resolveRunningStep();
      resolve();
    });
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
