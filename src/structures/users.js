// eslint-disable-next-line strict
'use strict';

/**
 * User collection template for creating all Users collections
 */
class Users {
    constructor(client, data) {
        /**
         * The client that created the instance of the channel
         * @name Users#client
         * @type {Client}
         * @readonly
         */
        Object.defineProperty(this, 'client', { value: client });

        this.channel = data.channel;

        this.userName = data.userName;
        this.username = this.userName;

        this.haveBadges = data.haveBadges ? data.haveBadges : false;
        this.badges = data.badges ? data.badges : '';
        this.color = data.color ? data.color : '#FFFFFF';
        this.displayName = data.displayName ? data.displayName : '';
        this.hasFlags = data.hasFlags ? data.hasFlags : false;
        this.id = data.id ? data.id : '';
        this.mod = data.mod ? data.mod : false;
        this.subscriber = data.subscriber ? data.subscriber : false;
        this.turbo = data.turbo ? data.turbo : false;
        this.userType = data.userType ? data.userType : false;
        this.vip = data.vip ? data.vip : false;
        this.staff = data.staff ? data.staff : false;
        this.admin = data.admin ? data.admin : false;
        this.globalMod = data.globalMod ? data.globalMod : false;

        this.self = data.self;
        this.broadcaster = data.broadcaster ? data.broadcaster : false;
    }

    timeout(channel, secounds, reason) {
        if (typeof(channel) === 'number') {
            reason = secounds;
            secounds = channel;
        }
        return this.client.sleept.methods.sendMessage(
            (this.channel ? (typeof(this.channel) === 'string' ? this.channel : this.channel.name) : channel), 
            '/timeout ' + this.userName + ' ' + secounds + ' ' + reason);
    }
}

module.exports = Users;
