// eslint-disable-next-line strict
'use strict';

const run = (logger, client, channels, mainChannel) => {
    return new Promise((resolve, reject) => {
        client.leave(mainChannel).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = {
    name: 'Leave Test',
    run: run,
    order: 3
};