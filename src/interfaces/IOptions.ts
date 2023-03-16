/* eslint-disable no-unused-vars */

import { ELoggerLevel, ILoggerOptions } from '@promisepending/logger.js';

export enum EWebSocketType {
    ws = 'ws',
    wss = 'wss'
}

export interface IHTTPOptions {
    host?: string;
    hostID?: string;
    headers?: { [key: string]: string };
}

export interface IWebSocketOptions {
    host?: string;
    port?: number;
    type?: EWebSocketType;
}

export interface IClientOptions {
    connectionWaitTimeout?: number | boolean;
    loginWaitInterval?: number;
    loginWaitTimeout?: number | boolean;
    autoLogEndEnabled?: boolean;
    autoLogEndUncaughtException?: boolean;
    channels?: string[];
    connectedChannels?: string[];
    debug?: boolean;
    fetchAllChatters?: boolean;
    http?: IHTTPOptions;
    messageCacheLifetime?: number;
    messageCacheMaxSize?: number;
    messageSweepInterval?: number;
    retryInterval?: number;
    retryLimit?: number;
    sync?: boolean;
    syncInterval?: number;
    ws?: IWebSocketOptions;
    loggerOptions?: ILoggerOptions;
    prefix?: string;
    disableFatalCrash?: boolean,
}

export const defaultOptions: IClientOptions = {
  connectionWaitTimeout: 10000,
  loginWaitInterval: 1000,
  loginWaitTimeout: 10000,
  autoLogEndEnabled: false,
  autoLogEndUncaughtException: true,
  channels: [],
  connectedChannels: [], // Private Don't touch
  debug: false,
  fetchAllChatters: true,
  http: {
    host: 'https://tmi.twitch.tv',
    hostID: 'https://id.twitch.tv',
    headers: {
      'User-Agent': 'TwitchJsApi/2.0.0',
    },
  },
  messageCacheLifetime: 60,
  messageCacheMaxSize: 100,
  messageSweepInterval: 10,
  retryInterval: 1000,
  retryLimit: Infinity,
  sync: false,
  syncInterval: 1000,
  ws: {
    host: 'irc-ws.chat.twitch.tv',
    port: 443,
    type: EWebSocketType.wss,
  },
  loggerOptions: {
    defaultLevel: ELoggerLevel.INFO,
    prefix: '',
    coloredBackground: false,
    allLineColored: false,
    debug: false,
    disableFatalCrash: false,
  },
  prefix: '',
  disableFatalCrash: false,
};
