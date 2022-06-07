export = WSMethods;
/**
 * The main file. Connect with twitch websocket and provide access to irc.
 * @private
 */
declare class WSMethods {
    constructor(wsMananger: any);
    wsManager: any;
    client: any;
    _ackToken: any;
    getChatter: any;
    validate: any;
    connected: number;
    isAnonymous: boolean;
    joinQueueTimeout: any[];
    leaveQueueTimeout: any[];
    logger: any;
    /**
     * @returns {boolean} if websocket is connected
     */
    isConnected(): boolean;
    /**
     * Connects with websocket and auth with IRC
     * @param {string} [token] the bot token
     * @param {boolean} [false] Connect with IRC in anonymous mode
     * @returns {Promise<void>} when connected with IRC
     */
    login(token?: string): Promise<void>;
    userName: any;
    id: any;
    scopes: any;
    server: {
        host: any;
        port: any;
    };
    ws: any;
    /**
     * Called every time a websocket message is received by IRC
     * @param {string} [event] the raw message event to be parsed
     */
    onMessage(event?: string): void;
    MessageRawSplited: any;
    /**
     * Called when websocket went a error
     * @param {string} [event] the raw error object to be parsed
     */
    onError(event?: string): void;
    /**
     * Called when websocket connection close
     */
    onClose(): void;
    /**
     * Called when websocket connection opens
     * @private
     */
    private onOpen;
    ready: boolean;
    /**
     * Called when websocket receives a message
     * @param {any} [messageObject] the object parsed by parser on onMessage
     * @private
     */
    private handlerMessage;
    readyAt: number;
    pingLoop: any;
    latency: Date;
    pingTimeout: any;
    wasCloseCalled: boolean;
    /**
     * Called after websocket successfully connect with IRC and be  ready state
     * @private
     */
    private onConnected;
    /**
     * Connects with a twitch channel chat
     * @param {string} [channel] the channel name who will be connected
     * @param {number} [index] the index of channels list of element
     * @return {Promise<void>} Resolved when sucessfull connect with channel
     */
    join(channel?: string, index?: number): Promise<void>;
    /**
     * Leave from a twitch channel chat
     * @param {string} [channel] the channel name who will be leaved
     * @return {Promise<void>} Resolved when sucessfull leave of the channel
     */
    leave(channel?: string): Promise<void>;
    /**
     * Send a ping message to websocket
     * @return {Promise<number>} The ping in milliseconds with IRC
     */
    ping(): Promise<number>;
    /**
     * Send a message to channel
     * @param {string} [channel] The channel name where the message will be delivered
     * @param {string} [message] The message content who will be sended
     * @param {Array<any>} [replacer] The replacements for %s on message content
     * @return {Promise<void>} returns when the message is sended
     */
    sendMessage(channel?: string, message?: string, ...replacer?: Array<any>): Promise<void>;
    /**
     * Generate users collections and added it to channel user collection
     * @param {string} [channelName] The name of the channel to search for users
     * @private
     */
    private generateUser;
    /**
     * Updates a user collection with the new data
     * @param {object} [data] The messageObject returned from twitch with a user data
     * @private
     */
    private updateUser;
    /**
     * Disconnect from IRC
     * @return {Promise<[string, number]>} returns when IRC sucessfull disconnect
     */
    disconnect(): Promise<[string, number]>;
    /**
     * Reply a message sended on channel
     * @param {string} [msgId] The id of the message who will be responded
     * @param {string} [channel] The channel name where the message will be delivered
     * @param {string} [message] The message content who will be sended
     * @param {Array<any>} [replacer] The replacements for %s on message content
     * @return {Promise<void>} returns when the message is sended
     */
    replyMessage(msgId?: string, channel?: string, message?: string, ...replacer?: Array<any>): Promise<void>;
    /**
     * @param {string} rawMessage a string with a websocket message to be sended to twitchIRC
     * @return {Promise<any>} the websocket return of the message
     */
    sendRawMessage(rawMessage: string): Promise<any>;
}
//# sourceMappingURL=WSMethods.d.ts.map