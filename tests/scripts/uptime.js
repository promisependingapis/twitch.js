// eslint-disable-next-line strict
'use strict';

const run = (logger, client) => {
    return new Promise((resolve, reject) => {
        client.uptime().then((result) => {
            logger.debug(`${result}ms uptime`);
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = {
    name: 'Uptime Test',
    run: run,
    order: 6
};
