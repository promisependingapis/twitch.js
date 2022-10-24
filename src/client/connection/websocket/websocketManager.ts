import { IWSMethod, IWSMethodRunCondition } from '../../../interfaces';
import { parser } from '../../../utils';
import { Client } from '../../client';
import { RestManager } from '../rest';
import * as ws from 'ws';
import path from 'path';
import fs from 'fs';

export class WebSocketManager {
  private pingLoopInterval: ReturnType<typeof setInterval>;
  private pingLoopTimeout: ReturnType<typeof setTimeout>;
  private methods: { [key: string]: IWSMethod } = {};
  private connection: ws.WebSocket;
  private restManager: RestManager;
  private username = 'TwitchJSV2';
  private methodsFolder: string;
  private isAnonymous: boolean;
  private pingFailures = 0;
  private client: Client;

  constructor(client: Client) {
    this.methodsFolder = path.resolve(__dirname, 'methods');
    this.client = client;
    this.restManager = this.client.getRestManager();
    this.isAnonymous = null;
  }

  async loadMethods(): Promise<void> {
    return new Promise(async (resolve) => {
      this.client.getLogger().debug('Loading WebSocket Methods...');
      const methods = fs.readdirSync(this.methodsFolder);
      for (const method of methods) {
        if ((method.endsWith('.ts') || method.endsWith('.js')) && !method.includes('.d.ts')) {
          this.client.getLogger().debug(`Loading WebSocket Method: ${method} ...`);
          const methodName = method.replace(/(\.js)|(\.ts)/g, '').toLowerCase();
          const loadedMethod = require(path.resolve(this.methodsFolder, method));
          const newMethod = new loadedMethod.default(this.client);
          // eslint-disable-next-line no-await-in-loop
          const runConditions: IWSMethodRunCondition = await newMethod.preLoad();
          this.methods[methodName] = { method: newMethod, runConditions, execute: newMethod.execute.bind(newMethod) };
          this.client.getLogger().debug(`Loaded WebSocket Method: ${methodName}!`);
        }
      }
      this.client.getLogger().debug('Loaded ' + Object.keys(this.methods).length + ' WebSocket Methods!');
      resolve();
    });
  }

  public async start(): Promise<void> {
    return new Promise(async (resolve) => {
      this.client.getLogger().debug('Starting WebSocket Manager...');

      const options = this.client.getOptions();

      this.connection = new ws.WebSocket(`${options.ws.type}://${options.ws.host}:${options.ws.port}`);

      this.connection.on('open', () => { this.onOpen(); resolve(); });
      this.connection.on('message', (data: string | Buffer) => { this.onMessage(data.toString()); });
      this.connection.on('error', (err: Error) => { this.onError(err); });
      this.connection.on('close', (code: number, reason: string | Buffer) => { this.onClose(code, reason.toString()); });
    });
  }

  public async login(token?: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      var continueLogin = true;
      this.client.getLogger().debug('Logging in...');
      if (token || 'CLIENT_TOKEN' in process.env) {
        if (!token && 'CLIENT_TOKEN' in process.env) token = process.env.CLIENT_TOKEN;
        this.client.getLogger().debug('Validating token...');
        await this.restManager.get('getTokenValidation', token)
          .then(async (res: any) => {
            this.username = res.login.toString();
            this.client.getLogger().debug(`Logging in as ${this.username}...`);
            this.isAnonymous = false;
            this.connection.send(`PASS ${token}`);
            this.connection.send(`NICK ${this.username.toLowerCase()}`);
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .catch(async (ignored: any) => {
            this.client.getLogger().error('Invalid token provide!');
            continueLogin = false;
            return reject(new Error('Invalid token!'));
          });
      } else {
        this.client.getLogger().debug('Logging in as anonymous...');
        this.isAnonymous = true;
        this.connection.send('PASS SCHMOOPIIE');
        this.connection.send(`NICK justinfan${Math.floor(1000 + Math.random() * 9000)}`);
      }

      if (!continueLogin) return;

      this.connection.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');

      this.client.getLogger().debug('Logged in!');
      resolve();
    });
  }

  private onOpen(): void {
    this.client.getLogger().debug('WebSocket connection opened!');
  }

  private onMessage(message: string): void {
    const splittedMessage = message.split('\r\n');

    for (const line of splittedMessage) {
      this.client.getLogger().debug('Received message: ' + line);
      const parsedMessage = parser.parseMessage(line);

      if (this.methods[parsedMessage.command.command.toLowerCase()]) {
        const method = this.methods[parsedMessage.command.command.toLowerCase()];
        method.execute(parsedMessage);
      }
    }
  }

  private onError(err: Error): void {
    this.client.getLogger().error('WebSocket error: ' + err.message);
  }

  private onClose(code: number, reason: string): void {
    this.client.rawEmit('websocket.closed', { code, reason });
    clearTimeout(this.pingLoopTimeout);
    clearInterval(this.pingLoopInterval);
    if (code === 1000) return this.client.getLogger().debug('WebSocket connection closed!');
    this.client.getLogger().error('WebSocket closed: ' + reason + '. With code: ' + code);
  }

  /**
   * @private
   */
  public getConnection(): ws.WebSocket {
    return this.connection;
  }

  /**
   * @private
   */
  public pingLoop(): void {
    this.pingLoopInterval = setInterval(() => {
      this.connection.send('PING :tmi.twitch.tv');

      this.pingLoopTimeout = setTimeout(() => {
        this.pingFailures++;
        if (this.pingFailures >= 3) {
          this.client.getLogger().error('Failed to ping twitch 3 times, disconnecting!');
          this.disconnect(true);
          clearTimeout(this.pingLoopTimeout);
          clearInterval(this.pingLoopInterval);
        }
      }, 10000);

      this.client.on('pong', () => {
        this.pingFailures = 0;
        clearTimeout(this.pingLoopTimeout);
      });
    }, 60000);
  }

  public ping(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.send('PING :tmi.twitch.tv');
      const pingTimeout = setTimeout(() => {
        this.client.getLogger().error('Ping timeout!');
        reject(new Error('Ping timeout!'));
      }, 10000);
      this.client.on('pong', () => {
        clearTimeout(pingTimeout);
        resolve();
      });
    });
  }

  /**
   * Sends a message in the specified live chat
   * @param channel - The channel to send the message to
   * @param message - The message to send
   * @returns {Promise<void>} - Resolves when the message is sent
   */
  public async sendMessage(channel: string, ...message: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof channel !== 'string') {
        this.client.getLogger().warn('The channel must be a String');
        return reject('The channel must be a String');
      } else if (!message || message.length === 0) {
        this.client.getLogger().warn('Cannot send empty messages');
        return reject('Cannot send empty messages');
      } else if (this.isAnonymous) {
        this.client.getLogger().warn('Cannot send messages in anonymous mode!');
        return reject('Cannot send messages in anonymous mode!');
      } else if (!channel.startsWith('#')) {
        channel = '#' + channel;
      }
      this.connection.send(`PRIVMSG ${channel} :${(message as string[]).join(' ')}`);
      return resolve();
    });
  }

  public async disconnect(bypass: boolean = false): Promise<void> {
    return new Promise(async (resolve) => {
      if (this.connection.readyState === this.connection.CLOSED) return resolve();

      this.client.getLogger().debug('Disconnecting...');

      if (!bypass) {
        this.client.getLogger().debug('Leaving all channels...');
        const leavedChannels = this.client.channels.cache.filter(channel => { return channel.connected }).map(async channel => {
          return channel.leave().catch(() => null);
        });
        const leavedChannelsNames = await Promise.all(leavedChannels);
        this.client.getLogger().debug('Leaved channels: ' + leavedChannelsNames.join(', '));
      } else this.client.getLogger().warn('Bypassing channel leave...');

      this.client.getLogger().debug('Clearing timeouts...');
      clearTimeout(this.pingLoopTimeout);
      clearInterval(this.pingLoopInterval);

      this.client.getLogger().debug('Closing WebSocket connection...');
      if (!bypass) this.connection.close(1000, 'Client disconnect');
      else {
        this.connection.terminate();
        this.client.getLogger().warn('Connection was destroyed!')
      }

      this.client.on('websocket.closed', ({ code, reason }) => {
        this.client.getLogger().debug('Disconnected!');
        this.client.getLogger().debug('WebSocket closed: ' + reason + '. With code: ' + code);
        resolve();
      });
    });
  }
}
