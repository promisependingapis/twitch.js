// eslint-disable-next-line strict
'use strict';

const path = require('path');
const { logger, collection } = require(path.resolve(__dirname,'..','utils'));
// eslint-disable-next-line no-unused-vars
const { Client } = require(path.resolve(__dirname, '..'));

/**
 * Channel collection template for creating all channels collections
 */
class Channels {
    /**
     * @class
     * @param {Client} [client] 
     * @param {object} [data] 
     */
    constructor(client, data) {
        /**
         * The client that created the instance of the channel
         * @name Channel#client
         * @type {Client}
         * @readonly
         */
        Object.defineProperty(this, 'client', { value: client });

        this.name = data.channel;
        this.connected = false;
        this.users = new collection();
        this.emoteOnly = false;
        this.followersOnly = false;
        this.followersOnlyCooldown = -1; // In minutes
        this.r9k = false;
        this.rituals = false;
        this.id = '';
        this.slowMode = false;
        this.slowCooldown = 0; // In seconds
        this.subsOnly = false;
    }
    /**
     * Return if the bot is connected with channel
     * @returns {boolean} true if connected, false if don't
     * @example
     * Client.channels.get('channelName').isConnected()
     */
    isConnected() {
        return this.connected;
    }

    /**
     * Send message into the channel
     * @param {string} [message] The message that will be sended
     * @param {?Array<string>} [replacer] If the message contains %s, the array that will replace the %s in order
     * @returns {Promise<any>}
     * @example
     * Client.channels.get('channelName').send('message', ['replacer', 'replacer2', ...])
     */
    send(message, replacer) {
        if (this.isConnected() && this.client.channels.get(this.name)) {
            return this.client.wsManager.methods.sendMessage(this.name, message, replacer);
        } else {
            logger.error('Not connected to the channel: ' + this.name);
            return Promise.reject('Not connected to the channel: ' + this.name);
        }
    }
}

module.exports = Channels;
