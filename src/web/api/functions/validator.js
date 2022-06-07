// eslint-disable-next-line strict
'use strict';

const rPath = require('path');
const TwitchWebAPIC = require(rPath.resolve(__dirname,'..','twitchWebAPI'));

// skipcq: JS-0239
var request;
// skipcq: JS-0239
var toptions;

/**
 * The class for the validator function 
 * @class Validator
 * @param {Object} options - The options for the validator
 */
class validator {
    constructor(options) {
        toptions = options;
        const TwitchWebAPI = new TwitchWebAPIC(options);
        request = TwitchWebAPI.request;
    }

    /**
     * validate the token on twitch's servers
     * @param {string} token the token to validate
     * @returns {Promise<any} a promise that resolves to the token if valid, or rejects with an error
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
