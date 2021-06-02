const path = require('path');
const TwitchWebAPIC = require(path.resolve(__dirname,'..','twitchWebAPI'));

var request;
var runValidator;

/**
 * The class for the follow channel function 
 */
class chatters {
    constructor(options) {
        const TwitchWebAPI = new TwitchWebAPIC(options);
        request = TwitchWebAPI.request;
    }

    /**
     * Follow channel
     */
    followChannel(channelName) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            if (channelName.startsWith('#')) {channelName = channelName.slice(1);}
            const path = `/group/user/${channelName}/chatters`;
            const header = {

            };

            request('post', path, {headers: header}).then(result => {
                return resolve(result);
            }).catch(err => {
                return reject(err);
            });
        });
    }
}

module.exports = chatters;