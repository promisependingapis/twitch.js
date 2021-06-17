// eslint-disable-next-line strict
'use strict';

const run = (logger, client, channels, mainChannel) => {
    return new Promise((resolve, reject) => {
        client.login('oauth:TwitchJSAutomatizedTestFakeIrcToken').then(() => {
            // eslint-disable-next-line max-len
            client.ws.send('CHATTERS {channel: \'' + mainChannel + '\', users: [\'' + client.channels.get(mainChannel).users.array().map(value => {return value.userName;}).join('\', \'') + '\']}');
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = {
    name: 'Login Test',
    run: run,
    order: 0
};