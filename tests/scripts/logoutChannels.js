// eslint-disable-next-line strict
'use strict';

const run = (logger, client, channels, mainChannel) => {
  return new Promise((resolve, reject) => {
    client.leave(mainChannel).then(() => {
      if (client.channels.cache.has(mainChannel)) {
        return reject(new Error(`Failed to leave channel: ${mainChannel}`));
      }
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};

module.exports = {
    name: 'Leave Test',
    run: run,
    order: 4
};
