// eslint-disable-next-line strict
'use strict';

const rPath = require('path');
const TwitchWebAPIC = require(rPath.resolve(__dirname,'..','twitchWebAPI'));

// skipcq: JS-0239
var request;

/**
 * The class for the getChattersInfo function 
 */
class chatters {
    /**
     * @class
     * @param {object} [options]
     */
    constructor(options) {
        const TwitchWebAPI = new TwitchWebAPIC(options);
        request = TwitchWebAPI.request;
    }

    /**
     * Get chatter info
     * @param {string} [channelID] The ID of the channel
     * @returns {Promise<any>}
     */
    getChattersInfo(channelName) {
        return new Promise((resolve, reject) => {
            if (channelName.startsWith('#')) {channelName = channelName.slice(1);}
            const path = `/group/user/${channelName}/chatters`;
            request('get', path).then(result => {
                return resolve(result);
            }).catch(err => {
                return reject(err);
            });
        });
    }
}

module.exports = chatters;
