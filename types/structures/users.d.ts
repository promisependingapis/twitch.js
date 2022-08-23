export = Users;
/**
 * User collection template for creating all Users collections
 */
declare class Users {
    /**
     * @class
     * @param {Client} [client]
     * @param {object} [data]
     */
    constructor(client?: any, data?: object);
    channel: any;
    userName: any;
    username: any;
    haveBadges: any;
    badges: any;
    color: any;
    displayName: any;
    hasFlags: any;
    id: any;
    mod: any;
    subscriber: any;
    turbo: any;
    userType: any;
    vip: any;
    staff: any;
    admin: any;
    globalMod: any;
    self: any;
    broadcaster: any;
    /**
     * Timeout user on a channel
     * @param {?string} [channel]
     * @param {?number} [secounds]
     * @param {?string} [reason]
     * @returns {Promise<any>}
     */
    timeout(channel?: string | null, secounds?: number | null, reason?: string | null): Promise<any>;
    /**
     * Remove timeout from user
     * @param {string|Array<string>} [channel]
     * @returns {Promise<any>}
     */
    untimeout(channel?: string | Array<string>): Promise<any>;
    /**
     * Ban user from an channel
     * @param {string|Array<string>} [channel]
     * @param {?string} [reason]
     * @returns {Promise<any>}
     */
    ban(channel?: string | Array<string>, reason?: string | null): Promise<any>;
    /**
     * Unban user from a channel
     * @param {string|Array<string>} [channel]
     * @returns {Promise<any>}
     */
    unban(channel?: string | Array<string>): Promise<any>;
}
//# sourceMappingURL=users.d.ts.map