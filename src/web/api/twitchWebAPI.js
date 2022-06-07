// eslint-disable-next-line strict
'use strict';

const rPath = require('path');
const axios = require('axios');
const { logger: LoggerC } = require(rPath.resolve(__dirname,'..','..','utils'));
// skipcq: JS-0239
var logger;
// skipcq: JS-0239
var apiUrl;
// skipcq: JS-0239
var headers;

/**
 * Api for making http requests to twitch
 * @class TwitchWebAPI
 * @param {Object} options - Options for the twitch http request api
 */
class twitchRequest {
    constructor(options) {
        apiUrl = options.http.host;
        headers = options.http.headers;
        logger = new LoggerC({debug: options.debug});
    }

    /**
     * Do a http request to twitch web api
     * @param {string} [method] The http method to use
     * @param {string} [path] The path to the api endpoint
     * @param {object} [options] The options for the request
     */
    request(method, path, options) {
        return new Promise((resolve, reject) => {
            // skipcq: JS-0239
            var finalUrl;
            
            // skipcq: JS-0093
            !path.startsWith('http') ? finalUrl = (apiUrl + path) : finalUrl = path;
            
            // skipcq: JS-0239
            var hasParam = false;
    
            if (options) {
                if (options.params) {
                    hasParam = true;
                }
            }

            if (method === 'get') {
                if (hasParam) {
                    axios.get(finalUrl, { params: options.params, headers: options.params || headers }).then(result => {
                        return resolve(result.data);
                    }).catch(err => {
                        logger.error(err);
                        return reject(err);
                    });
                } else {
                    axios.get(finalUrl, { headers: (options ? (options.headers || headers) : headers) }).then(result => {
                        return resolve(result.data);
                    }).catch(err => {
                        logger.error(err);
                        return reject(err);
                    });
                }
            } else {
                axios.post(finalUrl, options.data, { headers: options.headers || headers }).then(result => {
                    return resolve(result.data);
                }).catch(err => {
                    logger.error(err);
                    return reject(err);
                });
            }
        });
    }
}

module.exports = twitchRequest;
