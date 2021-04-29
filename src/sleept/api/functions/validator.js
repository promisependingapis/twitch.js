const path = require('path');
const TwitchWebAPIC = require(path.resolve(__dirname,'..','twitchWebAPI'));

var request;
var toptions;

/**
 * The class for the validator function 
 */
class validator {
    constructor(options) {
        toptions = options;
        const TwitchWebAPI = new TwitchWebAPIC(options);
        request = TwitchWebAPI.request;
    }

    /**
     * validate
     */
    validate(token) {
        return new Promise((resolve, reject) => {
            const path = toptions.http.hostID + '/oauth2/validate';
            if (token.startsWith('oauth:')) {
                token = token.split(':');
                token[0] = 'OAuth';
                token = token.join(' ');
            } else {
                token = 'OAuth ' + token;
            }
            const header = {'Authorization': token};

            request('get', path, {headers: header}).then(result => {
                return resolve(result);
            }).catch(err => {
                return reject(err);
            });
        });
    }
}

module.exports = validator;