// eslint-disable-next-line strict
'use strict';

const path = require('path');
exports.Package = require(path.resolve(__dirname, '..','..','package.json'));

/**
 * Options for a client.
 * @typedef {Object} ClientOptions
 * @property {Number} [messageCacheMaxSize=200] Maximum number of messages to cache per channel
 * (-1 or Infinity for unlimited - don't do this without message sweeping, otherwise memory usage will climb
 * indefinitely) [Not implemented, don't change it]
 * @property {Number} [messageCacheLifetime=0] How long a message should stay in the cache until it is considered
 * sweepable (in seconds, 0 for forever) [Not implemented, don't change it]
 * @property {Number} [messageSweepInterval=0] How frequently to remove messages from the cache that are older than
 * the message cache lifetime (in seconds, 0 for never) [Not implemented, don't change it]
 * @property {Boolean} [fetchAllChatters=true] Whether to cache all channel chatters and users upon startup, as well as
 * upon joining a channel (should be avoided whenever possible) [Not implemented, don't change it]
 * @property {Boolean} [sync=false] Whether to periodically sync channels (for user accounts) [Not implemented, don't change it]
 * @property {Number} [retryLimit=infinity] How many times twitch.js will try to connect with twitchIRC [Not implemented, don't change it]
 * @property {WSEventType[]} [disabledEvents=[]] An array of disabled websocket events. Events in this array will not be
 * processed, potentially resulting in performance improvements for larger bots. Only disable events you are
 * 100% certain you don't need, as many are important, but not obviously so. [Not implemented, don't change it]
 * @property {Boolean} [autoLogEnd=true] autoLogEnd option
 * @property {String[]} [channels=[]] Channels bot will listen
 * @property {String[]} [connectedChannels=[]] Array of channels where bot is connected
 * @property {Boolean} [debug=false] Starts the bot in debug mode if activated
 * @property {WebsocketOptions} [ws] Options for the WebSocket
 * @property {HTTPOptions} [http] HTTP options
 */
exports.defaultOptions = {
    messageCacheMaxSize: 200,
    messageCacheLifetime: 0,
    messageSweepInterval: 0,
    fetchAllChatters: true,
    sync: false,
    retryLimit: Infinity,
    disabledEvents: [],
    autoLogEnd: true,
    channels: [],
    connectedChannels: [],
    debug: false,

    /**
     * WebSocket options (these are left as snake_case to match the API)
     * @typedef {Object} WebsocketOptions
     * @property {String} [host='irc-ws.chat.twitch.tv'] The default host to use into WebSocket.
     * @property {Number} [port=443] The default port to use into WebSocket.
     * @property {String} [type='wss'] The default type of WebSocket (Must be 'ws' or 'wss').
     * @property {Number} [large_threshold=250] Number of chatters in a channel to be considered large [Not implemented, don't change it]
     */
    ws: {
        host: 'irc-ws.chat.twitch.tv',
        port: 443,
        type: 'wss',
        large_threshold: 250,
    },

    /**
     * HTTP options
     * @typedef {Object} HTTPOptions
     * @property {Number} [version=7] Default API version to use [Not implemented, don't change it]
     * @property {String} [host='tmi.twitch.tv'] Base url of the IRC
     * @property {String} [hostID='id.twitch.tv'] Base url of the ID IRC
     * @property {Object} [headers] Default http request options
     */
    http: {
        version: 7,
        host: 'https://tmi.twitch.tv',
        hostID: 'https://id.twitch.tv',
        headers: {
            'User-Agent': 'TwitchJsApi/1.0.0',
        },
    },
};

exports.errors = {
    INVALID_RATE_LIMIT_METHOD: 'Unknown rate limiting method.',
    INVALID_TOKEN: 'The token is not valid, a valid token must be a String, start with "oauth:" and doesn\'t includes spaces.',
    INVALID_USERNAME: 'The username is not valid. A valid username must be a String and doesn\'t includes spaces.',
};

exports.events = {
    RATE_LIMIT: 'rateLimit',
    READY: 'ready',
};