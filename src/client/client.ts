import { IClientOptions, defaultOptions } from '../interfaces/';
import { BasicUserStructure, ChannelStructure } from '../structures';
import { ChannelManager, UserManager } from './managers/';
import { WebSocketManager } from './connection/websocket';
import { RestManager } from './connection/rest';
import EventEmitter from 'events';

export class Client extends EventEmitter {
  public channels: ChannelManager;
  public user: BasicUserStructure | null = null;
  public isAnonymous: boolean;

  private readonly options: IClientOptions;

  /**
   * @private
   */
  public userManager: UserManager;
  private wsManager: WebSocketManager;
  private restManager: RestManager;
  private tokenVerified: boolean;
  private token: string | null;
  private isReady = false;
  private readyAt = 0;

  constructor(options: IClientOptions) {
    super();

    this.token = null;
    this.tokenVerified = false;
    this.isAnonymous = false;
    this.restManager = new RestManager(this);
    this.wsManager = new WebSocketManager(this);

    this.userManager = new UserManager(this);
    this.channels = new ChannelManager(this);

    this.options = this.mergeConfigs(defaultOptions as {[key: string]: unknown}, options as {[key: string]: unknown}) as IClientOptions;
  }

  private mergeConfigs<T extends {[key: string]: unknown}>(baseObject: T, newOptions: Partial<T>): T {
    const result = baseObject as {[key: string]: unknown};
    for (const [key, value] of Object.entries(newOptions)) {
      if (['string', 'number', 'boolean', 'symbol'].includes(typeof(value)) || Array.isArray(value)) {
        result[key] = value;
      } else if (typeof(value) === 'object') {
        result[key] = this.mergeConfigs(result[key] as {[key: string]: unknown}, value);
      }
    }
    return result as T;
  }

  /**
   * Starts the step manager and log in twitch.
   * @param {?string} token - The token to use for the login
   * @returns {Promise<void>}
   */
  public async login(token: string | null = null): Promise<void> {
    return new Promise(async (resolve) => {
      this.token = token;
      this.tokenVerified = true;
      await this.restManager.loadAllMethods();
      await this.wsManager.loadMethods();
      await this.waitForToken();
      await this.wsManager.start();
      await this.wsManager.login(this.token);
      await this.waitForTwitchConnection();

      if (this.options.channels!.length > 0) {
        await this.multiJoin(this.options.channels!).catch((err) => {
          this._rawEmit('error', 'Error while joining channels.', err);
        });
      }

      this.readyAt = Date.now();
      this._rawEmit('ready', this.options.ws!.host, this.options.ws!.port);
      return resolve();
    });
  }

  /**
   * returns the client uptime in milliseconds
   * @returns {number} the number of milliseconds since the client is ready
   * @example
   * const uptime = Client.uptime();
   **/
  public uptime(): number {
    return Math.max((Date.now() - this.readyAt), 0);
  }

  /**
   * Do a ping to twitch and returns the response time in milliseconds
   * @returns {Promise<number>} - The twitch response time in milliseconds
   */
  public async ping(): Promise<number> {
    const currentTimestamp = Date.now();
    await this.wsManager.ping();
    return Promise.resolve(Date.now() - currentTimestamp);
  }

  /**
   * Checks if a channel is currently in live
   * @param channel - The channel name to check
   * @throws {Error} - If the client is not ready or the channel name is invalid
   * @throws {Error} - If the channel name includes spaces or starts with '#'
   * @throws {Error} - If there is an error while checking the channel status
   * @returns {Promise<boolean>} - Returns true if the channel is live, false otherwise
   */
  public async isChannelLive(channel: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) return reject(new Error('Client is not ready!'));
      if (!this.token) return reject(new Error('You must login before checking if a channel is live!'));
      if (!this.options.twitchAPI?.clientId) return reject(new Error('Twitch API client ID is not set!'));
      if (channel.includes(' ')) return reject(new Error(`Channel name cannot include spaces: ${channel}`));
      if (channel.startsWith('#')) channel = channel.substring(1);
      this.restManager.get('streams', this.token, channel)
        .then((data: any) => {
          if (data.data && data.data.length > 0) {
            return resolve(true);
          } else {
            return resolve(false);
          }
        })
        .catch((err: any) => {
          this._rawEmit('error', 'Error while checking if channel is live', err);
          return reject(err);
        });
    });
  }

  /**
   * Connects with a twitch channel chat
   * @param {string} channel - The channel name who will be connected
   * @return {Promise<string>} - Resolved when successfully connect with channel
   */
  public async join(channel: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isReady) return reject(new Error('Client is not ready!'));
      if (channel.includes(' ')) return reject(new Error(`Channel name cannot include spaces: ${channel}`));
      if (channel.startsWith('#')) channel = channel.substring(1);
      if (this.channels.get(channel)?.connected) return;

      this.wsManager.getConnection()!.send(`JOIN #${channel.toLowerCase()}`);

      let timeout: ReturnType<typeof setTimeout> | null = null;

      function onJoin(joinedChannel: ChannelStructure): void {
        if (joinedChannel.name === channel) {
          if (timeout) clearTimeout(timeout);
          return resolve(channel);
        }
      }

      timeout = setTimeout(() => {
        this.removeListener('join', onJoin);
        return reject('Timeout while connecting to channel: ' + channel);
      }, 10000);

      this.on('join', onJoin);
    });
  }

  /**
   * Connects in multiples twitch channels chats
   * @param {Array<string>} channels - The array of channels to join
   * @return {Promise<string>} - Resolved when successfully connect with channel
   */
  public async multiJoin(channels: string[]): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (!this.wsManager.getConnection()) return reject(new Error('Connection not opened!'));
      if (channels.length === 0) return reject(new Error('No channels to join!'));

      channels.forEach((channel, index) => {
        if (channel.includes(' ')) return reject(new Error(`Channel name cannot include spaces: ${channel}`));
        if (!channel.startsWith('#')) channels[index] = `#${channel}`;
      });

      this.wsManager.getConnection()!.send(`JOIN ${channels.join(',').toLowerCase()}`);

      const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

      channels.forEach((channel) => {
        timeouts.set(channel, setTimeout(() => {
          channels.splice(channels.indexOf('#' + channel), 1);
          timeouts.delete('#' + channel);
          return reject(new Error(`Timeout while connecting to channel: ${channel}`));
        }, 10000));
      });

      this.on('join', (joinedChannel: ChannelStructure) => {
        if (channels.includes('#' + joinedChannel.name)) {
          clearTimeout(timeouts.get('#' + joinedChannel.name));
          channels.splice(channels.indexOf('#' + joinedChannel.name), 1);
          timeouts.delete('#' + joinedChannel.name);
        }

        if (channels.length === 0) return resolve(channels.join(', ').toLowerCase());
      });
    });
  }

  /**
   * Disconnects from a twitch channel chat
   * @param {string} channel - The channel name who will be disconnected
   * @returns {Promise<string>} - Resolved with channel name when successfully disconnect with channel
   */
  public async leave(channel: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isReady) return reject(new Error('Client is not ready!'));
      if (channel.includes(' ')) return reject(new Error(`Channel name cannot include spaces: ${channel}`));
      if (channel.startsWith('#')) channel = channel.substring(1);
      if (this.user?.username === `#${channel}`) return reject(new Error('You can\'t leave your own channel'));

      if (!this.channels.get(channel)?.connected) return reject(new Error(`Already disconnected from ${channel}!`));

      this.wsManager.getConnection()!.send(`PART #${channel.toLowerCase()}`);

      this.on('leave', (ch: ChannelStructure) => { if (ch.name === channel) resolve(channel); });
    });
  }

  /**
   * Disconnects from twitch server and stop the client
   * @returns {Promise<void>}
   */
  public async disconnect(): Promise<void> {
    return new Promise(async (resolve) => {
      this.once('disconnected', () => {
        return resolve();
      });
      await this.wsManager.disconnect();
    });
  }

  /**
   * @override
   * @private
   */
  public emit(eventName: string | symbol, ...args: any[]): boolean {
    console.warn(`You are emitting an event as the client, this can lead to unexpected behaviors and its not recommend!\n
      We are still going to emit the event, but you should avoid it!`);
    return super.emit(eventName, ...args);
  }

  /**
   * @private
   */
  public _rawEmit(eventName: string | symbol, ...args: any[]): boolean {
    return super.emit(eventName, ...args);
  }

  /**
   * Get the client options
   * @returns {IClientOptions} [IClientOptions] - The client options
   */
  public getOptions(): IClientOptions {
    return this.options;
  }

  /**
   * Get the REST API Manager Instance
   * @returns {RestManager} [RestManager] - The REST API Manager Instance
   */
  public getRestManager(): RestManager {
    return this.restManager;
  }

  /**
   * Get the WebSocket Manager Instance
   * @returns {WebSocketManager} [WebSocketManager] - The WebSocket Manager Instance
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

  private async waitForToken(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let tokenTimeout: ReturnType<typeof setTimeout>;
      if (this.tokenVerified) return resolve();
  
      const tokenVerifier = setInterval(async () => {
        if (!this.token) return;
        clearInterval(tokenVerifier);
        if (tokenTimeout) clearTimeout(tokenTimeout);
        resolve();
      }, this.options.loginWaitInterval);
  
      if (typeof this.options.loginWaitTimeout === 'number' && this.options.loginWaitTimeout > 0) {
        tokenTimeout = setTimeout(() => {
          clearInterval(tokenVerifier);
          reject(new Error('Too long without token!'));
        }, this.options.loginWaitTimeout);
      }
    });
  }

  private async waitForTwitchConnection(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let readyTimeout: ReturnType<typeof setTimeout>;
      if (this.isReady) return resolve();
  
      const connectionVerifier = setInterval(async () => {
        if (!this.isReady) return;
        clearInterval(connectionVerifier);
        if (readyTimeout) clearTimeout(readyTimeout);
        resolve();
      }, 500);
  
      if (typeof this.options.connectionWaitTimeout === 'number' && this.options.connectionWaitTimeout > 0) {
        readyTimeout = setTimeout(() => {
          clearInterval(connectionVerifier);
          reject(new Error('Too long without a response from Twitch!'));
        }, this.options.connectionWaitTimeout);
      }
    });
  }
}
