'use strict';

const run = async (logger, client) => {
    return new Promise(async (resolve) => {
        await client.disconnect();
        return resolve();
    });
};

module.exports = {
    name: 'Disconnect Test',
    run: run,
    order: 8
};
