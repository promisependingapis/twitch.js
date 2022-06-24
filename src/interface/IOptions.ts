/* eslint-disable no-unused-vars */
export enum EWebSocketType {
    ws = 'ws',
    wss = 'wss'
}

export interface HTTPOptions {
    host: string;
    hostID: string;
    headers: { [key: string]: string };
}

export interface WebSocketOptions {
    host: string;
    port: number;
    type: EWebSocketType;
}

export interface IClientOptions {
    autoLogEndEnabled: boolean;
    channels: string[];
    connectedChannels: string[];
    debug: boolean;
    fetchAllChatters: boolean;
    http: HTTPOptions;
    messageCacheLifetime: number;
    messageCacheMaxSize: number;
    messageSweepInterval: number;
    retryInterval: number;
    retryLimit: number;
    sync: boolean;
    syncInterval: number;
    ws: WebSocketOptions;
}
