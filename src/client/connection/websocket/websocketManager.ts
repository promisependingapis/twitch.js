import { IWSMethod, IWSMethodRunCondition } from '../../../interfaces';
import { parser } from '../../../utils';
import { Client } from '../../client';
import { RestManager } from '../rest';
import * as methods from './methods';
import * as ws from 'ws';

export class WebSocketManager {
  private pingLoopInterval: ReturnType<typeof setInterval> | null = null;
  private pingLoopTimeout: ReturnType<typeof setTimeout> | null = null;
  private methods: { [key: string]: IWSMethod } = {};
  private connection: ws.WebSocket | null = null;
  private restManager: RestManager;
  private username = 'TwitchJSV2';
  private isAnonymous = false;
  private pingFailures = 0;
  private client: Client;

  constructor(client: Client) {
    this.client = client;
    this.restManager = this.client.getRestManager();
  }

  /**
   * @private
   */
  public async loadMethods(): Promise<void> {
    return new Promise(async (resolve) => {
      for await (const [_, MethodClass] of Object.entries(methods)) {
        const newMethod = new (MethodClass as any)(this.client);
        const runConditions: IWSMethodRunCondition = await newMethod.preLoad();
        this.methods[runConditions.command!] = { method: newMethod, runConditions, execute: newMethod.execute.bind(newMethod) };
      }
      resolve();
    });
  }

  /**
   * @private
   */
  public async start(): Promise<void> {
    return new Promise((resolve) => {
      const wsOptions = this.client.getOptions().ws!;

      this.connection = new ws.WebSocket(`${wsOptions.type}://${wsOptions.host}:${wsOptions.port}`);

      this.connection.on('open', () => { this.onOpen(); resolve(); });
      this.connection.on('message', (data: string | Buffer) => { this.onMessage(data.toString()); });
      this.connection.on('error', (err: Error) => { this.onError(err); });
      this.connection.on('close', (code: number, reason: string | Buffer) => { this.onClose(code, reason.toString()); });
    });
  }

  /**
   * Loggin twitch chat.
   * @param {?string} token - The token to use for the connection. If not provided or false, the client will log in as anonymous.
   * @returns {Promise<void>}
   */
  public async login(token?: string | null): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let continueLogin = true;
      if (!this.connection) return reject(new Error('Connection not established!'));
      if (token || 'CLIENT_TOKEN' in process.env) {
        if (!token && 'CLIENT_TOKEN' in process.env) token = process.env.CLIENT_TOKEN;

        if (!token!.startsWith('oauth:')) {
          if (token!.includes(' ')) token = token!.split(' ')[1];
          console.warn('Non-standard token provided, Token should look like "oauth:", adding "oauth:" and proceeding...');
          token = `oauth:${token}`;
        }

        await this.restManager.get('getTokenValidation', token)
          .then((res: any) => {
            this.username = res.login.toString();
            this.isAnonymous = false;
            this.client.isAnonymous = false;
            this.connection!.send(`PASS ${token}`);
            this.connection!.send(`NICK ${this.username.toLowerCase()}`);
          })
          .catch((e) => {
            console.error(e);
            continueLogin = false;
            return reject(new Error('Invalid token!'));
          });
      } else {
        this.isAnonymous = true;
        this.client.isAnonymous = true;
        this.connection.send('PASS SCHMOOPIIE');
        this.connection.send(`NICK justinfan${Math.floor(1000 + Math.random() * 9000)}`);
      }

      if (!continueLogin) return;

      this.connection.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');

      resolve();
    });
  }

  private onOpen(): void {}

  private onMessage(message: string): void {
    const splittedMessage = message.split('\r\n');

    for (const line of splittedMessage) {
      const parsedMessage = parser.parseMessage(line);

      if (this.methods[parsedMessage.command.command.toLowerCase()]) {
        const method = this.methods[parsedMessage.command.command.toLowerCase()];
        method.execute(parsedMessage);
      }
    }
  }

  private onError(err: Error): void {
    this.client._rawEmit('error', 'WebSocket error:', err);
  }

  private onClose(code: number, reason: string): void {
    this.client._rawEmit('websocket.closed', { code, reason });
    if (this.pingLoopTimeout) clearTimeout(this.pingLoopTimeout);
    if (this.pingLoopInterval) clearInterval(this.pingLoopInterval);
    if (code === 1000) return;
    this.client._rawEmit('disconnected', code, reason || 'No reason provided');
    if (code === 1006) {
      this.client._rawEmit('error', 'WebSocket connection closed unexpectedly!');
      return;
    }
    this.client._rawEmit('error', 'WebSocket closed: ' + reason + '. With code: ' + code);
  }

  /**
   * @private
   */
  public getConnection(): ws.WebSocket | null {
    return this.connection;
  }

  /**
   * @private
   */
  public pingLoop(): void {
    this.pingLoopInterval = setInterval(() => {
      if (!this.connection) return;
      this.connection.send('PING :tmi.twitch.tv');

      this.pingLoopTimeout = setTimeout(() => {
        this.pingFailures++;
        if (this.pingFailures >= 3) {
          console.error('Failed to ping twitch 3 times, disconnecting!');
          this.disconnect(true);
          clearTimeout(this.pingLoopTimeout!);
          clearInterval(this.pingLoopInterval!);
        }
      }, 10000);

      this.client.once('pong', () => {
        this.pingFailures = 0;
        clearTimeout(this.pingLoopTimeout!);
      });
    }, 60000);
  }

  /**
   * Do a ping to twitch.
   * @returns {Promise<void>}
   */
  public ping(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.connection) return reject('Connection not established!');
      this.connection.send('PING :tmi.twitch.tv');
      const pingTimeout = setTimeout(() => {
        reject(new Error('Ping timeout!'));
      }, 10000);
      this.client.once('pong', () => {
        clearTimeout(pingTimeout);
        resolve();
      });
    });
  }

  /**
   * Sends a message in the specified live chat
   * @param {string} channel - The channel to send the message to
   * @param {string[]} message - The message to send
   * @returns {Promise<void>} - Resolves when the message is sent
   */
  public async sendMessage(channel: string, ...message: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.connection) return reject('Connection not established!');
      if (typeof channel !== 'string') {
        return reject('The channel must be a String');
      } else if (!message || message.length === 0) {
        return reject('Cannot send empty messages');
      } else if (this.isAnonymous) {
        return reject('Cannot send messages in anonymous mode!');
      } else if (!channel.startsWith('#')) {
        channel = '#' + channel;
      }
      this.connection.send(`PRIVMSG ${channel} :${message.join(' ')}`);
      return resolve();
    });
  }

  /**
   * Disconnects from the twitch server
   * @param {boolean} bypass - Bypass security checks
   * @returns {Promise<void>}
   */
  public async disconnect(bypass: boolean = false): Promise<void> {
    return new Promise(async (resolve) => {
      if (!this.connection || this.connection.readyState === this.connection.CLOSED) return resolve();

      if (!bypass) {
        const leavedChannels: string[] = [];
        await Promise.all(Array.from(this.client.channels.cache.values()).filter((channel) => { return channel.connected; }).map(async channel => {
          leavedChannels.push(channel.name);
          return channel.leave().catch((): void => {});
        }));

      } else console.warn('Bypassing channel leave...');

      if (this.pingLoopTimeout) clearTimeout(this.pingLoopTimeout);
      if (this.pingLoopInterval) clearInterval(this.pingLoopInterval);

      if (!bypass) this.connection.close(1000, 'Client disconnect');
      else {
        this.connection.terminate();
        console.warn('Connection was destroyed!');
      }

      this.client.once('websocket.closed', ({ code, reason }) => {
        this.client._rawEmit('disconnected', code, reason);
        resolve();
      });
    });
  }
}
