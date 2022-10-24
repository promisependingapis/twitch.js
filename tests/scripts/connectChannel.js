// eslint-disable-next-line strict
'use strict';

const run = (logger, client, channels, mainChannel) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        const promises = [];
        const rejects = [];
        channels.forEach((channel) => {
            if (channel !== mainChannel) {
                promises.push(
                    new Promise((resolve2) => {
                        client.join(channel).then(() => {
                            // eslint-disable-next-line max-len
                            client.ws.send('CHATTERS {channel: \'' + channel + '\', users: [\'' + client.channels.get(channel).users.array().map(value => {return value.userName;}).join('\', \'') + '\']}');
                            resolve2();
                        }).catch((err) => {
                            rejects.push(err);
                            resolve2();
                        });
                    })
                );
            }
        });
        await Promise.all(promises);
        if (rejects.length > 0) {
            reject(rejects);
        } else {
            resolve();
        }
    });
};

module.exports = {
    name: 'Connect Channels Test',
    run: run,
    order: 2
};
