'use strict';

const run = (logger, client, channels, mainChannel) => {
  return new Promise(async (resolve, reject) => {
    client.on('ready', () => {
      resolve();
    });
    await client.login('oauth:TwitchJSAutomatizedTestFakeIrcToken');
  })
};

module.exports = {
  name: 'Login Test',
  run: run,
  order: 1,
};
