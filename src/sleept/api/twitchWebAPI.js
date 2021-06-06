// eslint-disable-next-line strict
'use strict';

const rPath = require('path');
const axios = require('axios');
const { logger: LoggerC } = require(rPath.resolve(__dirname,'..','..','utils'));
var logger;
var apiUrl;
var headers;

/**
 * Api for making http requests to twitch
 */
class twitchRequest {
    constructor(options) {
        apiUrl = options.http.host;
        headers = options.http.headers;
        logger = new LoggerC({debug: options.debug});
    }

    /**
     * Do a http request to twitch web api
     * @param {String} path 
     * @param {Object} options 
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
