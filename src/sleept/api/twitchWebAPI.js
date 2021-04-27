const path = require('path');
const axios = require('axios');
const { logger: LoggerC } = require(path.resolve(__dirname,'..','..','utils'));
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
            var finalUrl;
            
            !path.startsWith('http') ? finalUrl = (apiUrl + path) : finalUrl = path;
            
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
