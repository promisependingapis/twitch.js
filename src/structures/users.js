// const {logger} = require('../utils');

class channels {
    constructor(client, data) {
        /**
         * The client that created the instance of the channel
         * @name Channel#client
         * @type {Client}
         * @readonly
         */
        Object.defineProperty(this, 'client', { value: client });

        this.name = data.userName;

        this.haveBadges = false;
        this.badges = '';
        this.color = '#FFFFFF';
        this.displayName = '';
        this.hasFlags = false;
        this.id = '';
        this.isMod = false;
        this.isSubscriber = false;
        this.isTurbo = false;
        this.userType = false;

        this.self = data.self;
        this.broadcaster = false;
    }
}

module.exports = channels;
