'use strict';

const run = (logger, client, channels, mainChannel) => {
  return new Promise(async (resolve, reject) => {
    await client.login('oauth:TwitchJSAutomatizedTestFakeIrcToken');
    client.on('ready', () => {
      resolve();
    });
  })
};

module.exports = {
  name: 'Login Test',
  run: run,
  order: 1,
};
