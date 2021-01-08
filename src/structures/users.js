// const {logger} = require('../utils');

class Users {
    constructor(client, data) {
        /**
         * The client that created the instance of the channel
         * @name Users#client
         * @type {Client}
         * @readonly
         */
        Object.defineProperty(this, 'client', { value: client });

        this.name = data.userName;

        this.haveBadges = data.haveBadges ? data.haveBadges : false;
        this.badges = data.badges ? data.badges : '';
        this.color = data.color ? data.color : '#FFFFFF';
        this.displayName = data.displayName ? data.displayName : '';
        this.hasFlags = data.hasFlags ? data.hasFlags : false;
        this.id = data.id ? data.id : '';
        this.isMod = data.isMod ? data.isMod : false;
        this.isSubscriber = data.isSubscriber ? data.isSubscriber : false;
        this.isTurbo = data.isTurbo ? data.isTurbo : false;
        this.userType = data.userType ? data.userType : false;
        this.isVip = data.isVip ? data.isVip : false;
        this.isStaff = data.isStaff ? data.isStaff : false;
        this.isAdmin = data.isAdmin ? data.isAdmin : false;
        this.isGlobalMod = data.isGlobalMod ? data.isGlobalMod : false;

        this.self = data.self;
        this.broadcaster = data.broadcaster ? data.broadcaster : false;
    }
}

module.exports = Users;
