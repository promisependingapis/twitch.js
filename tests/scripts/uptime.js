// eslint-disable-next-line strict
'use strict';

const run = (logger, client) => {
  return new Promise((resolve) => {
    logger.debug(`${client.uptime()}ms uptime`);
    return resolve();
  });
};

module.exports = {
  name: 'Uptime Test',
  run: run,
  order: 7
};
