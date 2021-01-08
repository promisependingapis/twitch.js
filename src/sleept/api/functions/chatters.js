const TwitchWebAPI = require('../twitchWebAPI');

/**
 * Get chatter info
 * @TODO: Convert into class
 */
function getChattersInfo(channelName) {
    return new Promise((reject, resolve) => {
        const path = `/group/user/${channelName}/chatters`;
        TwitchWebAPI.request('get', path).then(result => {
            return resolve(result);
        }).catch(err => {
            return reject(err);
        });
    });
}

module.exports = getChattersInfo;