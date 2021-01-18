const path = require('path');
const { logger, collection } = require(path.resolve(__dirname,'..','utils'));

class channels {
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
     * @returns {Boolean} true if connected, false if don't
     * @example
     * Client.channels.get('channelName').isConnected()
     */
    isConnected() {
        return this.connected;
    }

    /**
     * Send message into the channel
     * @param {String} [message] The message that will be sended
     * @param {Array<optional>} [replacer] If the message contains %s, the array that will replace the %s in order
     * @returns {Promise<Pending>}
     * @example
     * Client.channels.get('channelName').send('message', ['replacer', 'replacer2', ...])
     */
    send(message, replacer) {
        if (this.isConnected() && global.twitchApis.client.channels.get(this.name)) {
            return this.client.sleept.methods.sendMessage(this.name, message, replacer);
        } else {
            logger.error('Not connected to the channel: ' + this.name);
            return Promise.reject('Not connected to the channel: ' + this.name);
        }
    }
}

module.exports = channels;
