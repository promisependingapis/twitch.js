'use strict';

const run = async (logger, client) => {
    return new Promise(async (resolve, reject) => {
        client.on('disconnected', (code, reason) => {
            logger.debug(`Disconnected with code: ${code} and reason: ${reason}`);
            if (code !== 1000) {
                logger.error(`Unexpected disconnection code: ${code}. Reason: ${reason}`);
                return reject(new Error(`Unexpected disconnection code: ${code}. Reason: ${reason}`));
            }
        });
        await client.disconnect();
        return resolve();
    });
};

module.exports = {
    name: 'Disconnect Test',
    run: run,
    order: 8
};
