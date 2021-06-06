// eslint-disable-next-line strict
'use strict';

const run = (logger, client) => {
    return new Promise((resolve, reject) => {
        client.login('oauth:TwitchJSAutomatizedTestFakeIrcToken').then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = {
    name: 'login test',
    run: run,
    order: 0
};