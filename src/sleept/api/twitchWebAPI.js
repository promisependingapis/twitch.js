const path = require('path');
const axios = require('axios');
const { logger } = require(path.resolve(__dirname,'..','..','utils'));

var apiUrl;
var headers;

class twitchRequest {
    constructor(options) {
        apiUrl = options.http.api;
        headers = options.http.headers;
    }

    /**
     * Do a http request to twitch web api
     * @param {String} path 
     * @param {Object} options 
     */
    request(method, path, options) {
        return new Promise((resolve, reject) => {
            const finalUrl = apiUrl + path;
            
            var hasParam = false;
    
            if (options) {
                if (options.params) {
                    hasParam = true;
                }
            }
    
            if (method === 'get') {
                if (hasParam) {
                    axios.get(finalUrl, { params: options.params, headers: headers }).then(result => {
                        return resolve(result.data);
                    }).catch(err => {
                        logger.error(err);
                        return reject(err);
                    });
                } else {
                    axios.get(finalUrl, { headers: headers }).then(result => {
                        return resolve(result.data);
                    }).catch(err => {
                        logger.error(err);
                        return reject(err);
                    });
                }
            } else {
                axios.post(finalUrl, options.data, { headers: headers }).then(result => {
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
