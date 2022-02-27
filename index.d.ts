declare module '@twitchapis/twitch.js' {
    import { EventEmitter } from 'events';

    export class Client extends EventEmitter {
        constructor(options: IClientOptions);

        on: ClientEvents<this>;
        once: ClientEvents<this>;

        uptime(): Promise<number>;
        join(channel: string): Promise<IChannel>;
        leave(channel: string): Promise<void>;
        login(token: string): Promise<void>;
        ping(): Promise<number>;
        disconnect(): Promise<void>;
    }

    export interface IClientOptions {
        apiRequestMethod?: string;
        messageCacheMaxSize?: number;
        messageCacheLifetime?: number;
        messageSweepInterval?: number;
        fetchAllMembers?: boolean;
        sync?: boolean;
        sleepWsBridgeTimeout?: number;
        retryLimit?: number;
        disabledEvents?: any[];
        sleepTimeOffset?: number;
        autoLogEnd?: boolean;
        channels?: string[];
        connectedChannels?: any[];
        debug?: boolean;

        ws?: {
            large_threshold?: number;
            compress?: boolean;
            properties: { [key: string]: string };
            version?: number;
        };

        http?: {
            version?: number;
            host?: string;
            api?: string;
            headers: { [key: string]: string };
        };
    }

    export interface ILogger {
        info(msg: string): void;
        fatal(msg: string): void;
        error(msg: string): void;
        warn(msg: string): void;
        info(msg: string): void;
        debug(msg: string): void;
    }

    interface ClientEvents<T> {
        (event: 'userClear', handler: ({ channel: IChannel, user: IUser }) => void): T;
        (event: 'clearChat', handler: ({ channel: IChannel }) => void): T;
        (event: 'message', handler: (msg: IMessage) => void): T;
        (event: 'ready', handler: (host: string, port: number) => void): T;
        (event: 'join', handler: (channelName: string) => void): T;
        (event: 'leave', handler: (channelName: string) => void): T;
    }

    export interface IMessage {
        id: string;
        content: string;
        channel: IChannel;
        author: IUser;
        reply(msg: string): void;
        toString(): string;
    }

    export interface IUser {
        userName: string;
        haveBadges: boolean;
        color: string;
        displayName: string;
        hasFlags: boolean;
        id: string;
        mod: boolean;
        subscriber: boolean;
        turbo: boolean;
        userType: boolean;
        vip: boolean;
        admin: boolean;
        globalMod: boolean;
        broadcaster: boolean;
    }

    export interface IChannel {
        id: string;
        name: string;
        connected: boolean;
        users: IUser[];
        emoteOnly: boolean;
        followersOnly: boolean;
        followersOnlyCooldown: number;
        r9k: boolean;
        rituals: boolean;
        slowMode: boolean;
        slowCooldow: number;
        subsOnly: boolean;
        isConnected(): boolean;
        send(msg: string, replaces?: any[]): Promise<IMessage>;
    }

    export var logger: ILogger;
}
