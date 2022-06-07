// eslint-disable-next-line strict
'use strict';

const run = (logger, client) => {
    return Promise.resolve(client.disconnect());
};

module.exports = {
    name: 'Disconnect Test',
    run: run,
    order: 7
};