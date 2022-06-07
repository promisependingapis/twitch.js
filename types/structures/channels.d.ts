export = channels;
/**
 * Channel collection template for creating all channels collections
 */
declare class channels {
    constructor(client: any, data: any);
    name: any;
    connected: boolean;
    users: any;
    emoteOnly: boolean;
    followersOnly: boolean;
    followersOnlyCooldown: number;
    r9k: boolean;
    rituals: boolean;
    id: string;
    slowMode: boolean;
    slowCooldown: number;
    subsOnly: boolean;
    /**
     * Return if the bot is connected with channel
     * @returns {boolean} true if connected, false if don't
     * @example
     * Client.channels.get('channelName').isConnected()
     */
    isConnected(): boolean;
    /**
     * Send message into the channel
     * @param {string} [message] The message that will be sended
     * @param {?Array<string>} [replacer] If the message contains %s, the array that will replace the %s in order
     * @returns {Promise<any>}
     * @example
     * Client.channels.get('channelName').send('message', ['replacer', 'replacer2', ...])
     */
    send(message?: string, replacer?: Array<string> | null): Promise<any>;
}
//# sourceMappingURL=channels.d.ts.map