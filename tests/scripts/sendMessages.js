// eslint-disable-next-line strict
'use strict';

const run = (logger, client) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        const promises = [];
        const rejects = [];
        client.channels.cache.forEach((channel) => {
            promises.push(
                new Promise((resolve2) => {
                    channel.send(`[${Date.now()}] Automatic test message`).then(() => {
                        logger.debug(`Test message sucessfully sended to: ${channel.name}`);
                        resolve2();
                    }).catch((err) => {
                        rejects.push(err);
                        resolve2();
                    });
                })
            );
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
    name: 'Send Messages Test',
    run: run,
    order: 3
};
