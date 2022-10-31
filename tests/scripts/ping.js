// eslint-disable-next-line strict
'use strict';

const run = (logger, client) => {
    return new Promise((resolve, reject) => {
        client.ping().then((result) => {
            logger.debug(`${result}ms ping`);
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = {
    name: 'Ping Test',
    run: run,
    order: 6
};
