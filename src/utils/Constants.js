exports.Package = require('../../package.json');

/**
 * Options for a client.
 * @typedef {Object} ClientOptions
 * @property {string} [apiRequestMethod='sequential'] One of `sequential` or `burst`. The sequential handler executes
 * all requests in the order they are triggered, whereas the burst handler runs multiple in parallel, and doesn't
 * provide the guarantee of any particular order. Burst mode is more likely to hit a 429 ratelimit error by its nature,
 * and is therefore slightly riskier to use.
 * @property {number} [messageCacheMaxSize=200] Maximum number of messages to cache per channel
 * (-1 or Infinity for unlimited - don't do this without message sweeping, otherwise memory usage will climb
 * indefinitely)
 * @property {number} [messageCacheLifetime=0] How long a message should stay in the cache until it is considered
 * sweepable (in seconds, 0 for forever)
 * @property {number} [messageSweepInterval=0] How frequently to remove messages from the cache that are older than
 * the message cache lifetime (in seconds, 0 for never)
 * @property {boolean} [fetchAllMembers=false] Whether to cache all guild members and users upon startup, as well as
 * upon joining a guild (should be avoided whenever possible)
 * @property {boolean} [sync=false] Whether to periodically sync guilds (for user accounts)
 * @property {number} [sleeptWsBridgeTimeout=5000] Maximum time permitted between SLEEPT responses and their
 * corresponding websocket events
 * @property {number} [sleeptTimeOffset=500] Extra time in millseconds to wait before continuing to make SLEEPT
 * requests (higher values will reduce rate-limiting errors on bad connections)
 * @property {number} [retryLimit=Infinity] How many times to retry on 5XX errors
 * (Infinity for indefinite amount of retries)
 * @property {WSEventType[]} [disabledEvents] An array of disabled websocket events. Events in this array will not be
 * processed, potentially resulting in performance improvements for larger bots. Only disable events you are
 * 100% certain you don't need, as many are important, but not obviously so. The safest one to disable with the
 * most impact is typically `TYPING_START`.
 * @property {WebsocketOptions} [ws] Options for the WebSocket
 * @property {HTTPOptions} [http] HTTP options
 * @property {boolean} [autoLogEnd=true] autoLogEnd option
 * @property {string[]} [channels] Channels bot will listen
 * @property {string[]} [connectedChannels] Channels bot is connected
 * @property {boolean} [debug=false] Starts the bot in debug mode if activated
 */
exports.defaultOptions = {
    apiRequestMethod: 'sequential',
    messageCacheMaxSize: 200,
    messageCacheLifetime: 0,
    messageSweepInterval: 0,
    fetchAllMembers: false,
    sync: false,
    sleeptWsBridgeTimeout: 5000,
    retryLimit: Infinity,
    disabledEvents: [],
    sleeptTimeOffset: 500,
    autoLogEnd: true,
    channels: [],
    connectedChannels: [],
    debug: false,

    /**
     * WebSocket options (these are left as snake_case to match the API)
     * @typedef {Object} WebsocketOptions
     * @property {number} [large_threshold=250] Number of members in a guild to be considered large
     * @property {boolean} [compress=true] Whether to compress data sent on the connection
     * (defaults to `false` for browsers)
     */
    ws: {
        large_threshold: 250,
        compress: require('os').platform() !== 'browser',
        properties: {
            $os: process ? process.platform : 'twitch.js',
            $browser: 'twitch.js',
            $device: 'twitch.js',
            $referrer: '',
            $referring_domain: '',
        },
        version: 6,
    },

    /**
     * HTTP options
     * @typedef {Object} HTTPOptions
     * @property {number} [version=7] API version to use
     * @property {string} [api='irc-ws.chat.twitch.tv'] Base url of the API
     */
    http: {
        version: 7,
        host: 'irc-ws.chat.twitch.tv',
    },
};

exports.errors = {
    INVALID_RATE_LIMIT_METHOD: 'Unknown rate limiting method.',
    INVALID_TOKEN:
    'The token is not valid, a valid token must be a String, start with "oauth:" and doesn\'t includes spaces.',
    INVALID_USERNAME: 'The username is not valid. A valid username must be a String and doesn\'t includes spaces.',
};

exports.events = {
    RATE_LIMIT: 'rateLimit',
    READY: 'ready',
};

/** @todo: Endpoints */
