// eslint-disable-next-line strict
'use strict';

const path = require('path');
// eslint-disable-next-line no-unused-vars
const { Client } = require(path.resolve(__dirname, '..'));

/**
 * User collection template for creating all Users collections
 */
class Users {
    /**
     * @class
     * @param {Client} [client] 
     * @param {object} [data] 
     */
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

    /**
     * Timeout user on a channel
     * @param {?string} [channel] 
     * @param {?number} [secounds] 
     * @param {?string} [reason] 
     * @returns {Promise<any>}
     */
    timeout(channel, secounds, reason) {
        if (typeof(channel) === 'number') {
            reason = secounds;
            secounds = channel;
        }
        return this.client.sleept.methods.sendMessage(
            (this.channel ? (typeof(this.channel) === 'string' ? this.channel : this.channel.name) : channel), 
            '/timeout ' + this.userName + ' ' + secounds + ' ' + reason);
    }

    /**
     * Remove timeout from user
     * @param {string|Array<string>} [channel] 
     * @returns {Promise<any>}
     */
    untimeout(channel) {
        if (!channel || !(channel instanceof Array)) {
            if (!channel) channel = this.channel.name;

            return this.client.sleept.methods.sendMessage(channel, `/untimeout ${this.username}`);
        } else {
            channel.forEach((element) => {
                this.client.sleept.methods.sendMessage(element, `/untimeout ${this.username}`);
            });
        }
    }

    /**
     * Ban user from an channel
     * @param {string|Array<string>} [channel] 
     * @param {?string} [reason] 
     * @returns {Promise<any>}
     */
    ban(channel, reason) {
        if (!channel || !(channel instanceof Array)) {
            if (!reason) {
                reason = channel;
                channel = this.channel.name;
            }

            if (!reason) reason = '';

            return this.client.sleept.methods.sendMessage(channel, `/ban ${this.username} ${reason}`);
        } else {
            if (!reason) reason = '';

            channel.forEach((element) => {
                this.client.sleept.methods.sendMessage(element, `/ban ${this.username} ${reason}`);
            });
        }
    }

    /**
     * Unban user from a channel
     * @param {string|Array<string>} [channel] 
     * @returns {Promise<any>}
     */
    unban(channel) {
        if (!channel || !(channel instanceof Array)) {
            if (!channel) channel = this.channel.name;

            return this.client.sleept.methods.sendMessage(channel, `/unban ${this.username}`);
        } else {
            channel.forEach((element) => {
                this.client.sleept.methods.sendMessage(element, `/unban ${this.username}`);
            });
        }
    }
}

module.exports = Users;
