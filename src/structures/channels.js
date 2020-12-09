// const collection = require('../utils/collection');

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
    }

    send (message, replacer) {
        return this.client.sendMessage(this.name, message, replacer);
    }
}

module.exports = channels;