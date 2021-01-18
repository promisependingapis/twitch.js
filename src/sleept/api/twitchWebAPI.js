const path = require('path');
const axios = require('axios');
const apiUrl = global.twitchApis.client.option.http.api;
const headers = global.twitchApis.client.option.http.headers;
const { logger } = require(path.resolve(__dirname,'..','..','utils'));

/**
 * Do a http request to twitch web api
 * @param {String} path 
 * @param {Object} options 
 */
async function twitchRequest(method, path, options) {
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

exports.request = twitchRequest;
