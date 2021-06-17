// eslint-disable-next-line strict
'use strict';

const run = (logger, client) => {
    return new Promise((resolve) => {
        resolve(client.disconnect());
    });
};

module.exports = {
    name: 'Disconnect Test',
    run: run,
    order: 7
};