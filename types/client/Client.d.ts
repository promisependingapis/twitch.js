export = Client;
/**
 * Creates the main class to generate clients.
 * @extends {EventEmmiter}
 */
declare class Client {
    /**
     * @type {ClientOptions} [autoLogEnd boolean, Default: true]
     */
    constructor(options?: {});
    /**
     * The options the client was instantiated with
     * @type {ClientOptions}
     */
    options: ClientOptions;
    /**
     * Authorization token for the logged in user/bot
     * <warn>This should be kept private at all times.</warn>
     * @type {?string}
     * @private
     */
    private token;
    /**
     * User that the client is logged in as
     * @type {?ClientUser}
     */
    user: ClientUser;
    /**
     * Time at which the client was last regarded as being in the `READY` state
     * (each time the client disconnects and successfully reconnects, this will be overwritten)
     * @type {?date}
     */
    readyAt: date;
    /**
     * The bool of the system of auto logger finish event
     * @type {boolean}
     */
    autoLogEnd: boolean;
    /**
     * A collection with all channels
     * @type {collection}
     */
    channels: any;
    /**
     * The WebSocket manager of the client
     * @type {WSManager}
     * @private
     */
    private wsManager;
    ws: {
        send: (websocketstring: any) => any;
    };
    /**
     * Returns the time bot is connected with twitch in miliseconds
     * @returns {Promise<number>}
     * @example
     * await Client.uptime()
     * @example
     * Client.uptime().then((Time) => { })
     */
    uptime(): Promise<number>;
    /**
     * Logs the client in, establishing a websocket connection to Twitch.
     * @param {string} [token] Token of the account to log in with (Opcional)
     * @param {boolean} [false] False to Anonymous mode (Opcional)
     * @returns {Promise<void>}
     * @example
     * Client.login('token')
     *  .then()
     * @example
     * Client.login(false)
     *  .then()
     */
    login(token?: string): Promise<void>;
    /**
     * Join the bot on the channel parsed
     * @param {string} [channelName] The name of the channel the bot will connect
     * @returns {Promise<boolean>} true if the bot connect, false if it cannot connect
     * @example
     * client.join('channelName')
     *  .then()
     */
    join(channelName?: string): Promise<boolean>;
    /**
     * Leave the bot on the channel parsed
     * @param {string} [channelName] The name of the channel the bot will disconnect
     * @returns {Promise<boolean>} true if the bot disconnect, false if it cannot disconnect
     * @example
     * client.leave('channelName')
     *  .then()
     */
    leave(channelName?: string): Promise<boolean>;
    /**
     * Get the API ping
     * @returns {Promise<number>} return the API ping in milliseconds
     * @example
     * client.ping()
     */
    ping(): Promise<number>;
    /**
     * Emit a event from client level
     * @param {string} event the name of the event than will be sended
     * @param {any} args the args of the event
     * @example
     * client.eventEmmiter('event', Args)
     */
    eventEmmiter(event: string, ...args: any): void;
    /**
     * Disconnect client from TwitchIRC
     * @returns {Promise<void>} returned when client disconnect.
     */
    disconnect(): Promise<void>;
    /**
     * Validates the client options.
     * @param {ClientOptions} [options=this.options] Options to validate
     * @private
     */
    private _validateOptions;
}
//# sourceMappingURL=Client.d.ts.map