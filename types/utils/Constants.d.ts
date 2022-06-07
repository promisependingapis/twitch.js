export const Package: any;
export namespace defaultOptions {
    const messageCacheMaxSize: number;
    const messageCacheLifetime: number;
    const messageSweepInterval: number;
    const fetchAllChatters: boolean;
    const sync: boolean;
    const retryLimit: number;
    const disabledEvents: any[];
    const autoLogEnd: boolean;
    const channels: any[];
    const connectedChannels: any[];
    const debug: boolean;
    namespace ws {
        const host: string;
        const port: number;
        const type: string;
        const large_threshold: number;
    }
    namespace http {
        export const version: number;
        const host_1: string;
        export { host_1 as host };
        export const hostID: string;
        export const headers: {
            'User-Agent': string;
        };
    }
}
export namespace errors {
    const INVALID_RATE_LIMIT_METHOD: string;
    const INVALID_TOKEN: string;
    const INVALID_USERNAME: string;
}
export namespace events {
    const RATE_LIMIT: string;
    const READY: string;
}
/**
 * Options for a client.
 */
export type ClientOptions = {
    /**
     * Maximum number of messages to cache per channel
     * (-1 or Infinity for unlimited - don't do this without message sweeping, otherwise memory usage will climb
     * indefinitely) [Not implemented, don't change it]
     */
    messageCacheMaxSize?: number;
    /**
     * How long a message should stay in the cache until it is considered
     * sweepable (in seconds, 0 for forever) [Not implemented, don't change it]
     */
    messageCacheLifetime?: number;
    /**
     * How frequently to remove messages from the cache that are older than
     * the message cache lifetime (in seconds, 0 for never) [Not implemented, don't change it]
     */
    messageSweepInterval?: number;
    /**
     * Whether to cache all channel chatters and users upon startup, as well as
     * upon joining a channel (should be avoided whenever possible) [Not implemented, don't change it]
     */
    fetchAllChatters?: boolean;
    /**
     * Whether to periodically sync channels (for user accounts) [Not implemented, don't change it]
     */
    sync?: boolean;
    /**
     * How many times twitch.js will try to connect with twitchIRC [Not implemented, don't change it]
     */
    retryLimit?: number;
    /**
     * An array of disabled websocket events. Events in this array will not be
     * processed, potentially resulting in performance improvements for larger bots. Only disable events you are
     * 100% certain you don't need, as many are important, but not obviously so. [Not implemented, don't change it]
     */
    disabledEvents?: WSEventType[];
    /**
     * autoLogEnd option
     */
    autoLogEnd?: boolean;
    /**
     * Channels bot will listen
     */
    channels?: string[];
    /**
     * Array of channels where bot is connected
     */
    connectedChannels?: string[];
    /**
     * Starts the bot in debug mode if activated
     */
    debug?: boolean;
    /**
     * Options for the WebSocket
     */
    ws?: {
        /**
         * The default host to use into WebSocket.
         */
        host?: string;
        /**
         * The default port to use into WebSocket.
         */
        port?: number;
        /**
         * The default type of WebSocket (Must be 'ws' or 'wss').
         */
        type?: string;
        /**
         * Number of chatters in a channel to be considered large [Not implemented, don't change it]
         */
        large_threshold?: number;
    };
    /**
     * HTTP options
     */
    http?: {
        /**
         * Default API version to use [Not implemented, don't change it]
         */
        version?: number;
        /**
         * Base url of the IRC
         */
        host?: string;
        /**
         * Base url of the ID IRC
         */
        hostID?: string;
        /**
         * Default http request options
         */
        headers?: any;
    };
};
//# sourceMappingURL=Constants.d.ts.map