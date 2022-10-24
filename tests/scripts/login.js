'use strict';

const run = (logger, client, channels, mainChannel) => {
  return new Promise((resolve, reject) => {
    client.login('oauth:TwitchJSAutomatizedTestFakeIrcToken');
    client.on('ready', () => {
      /*client.getWebSocketManager().send(
        "CHATTERS {channel: '" +
          mainChannel +
          "', users: ['" +
          client.channels.cache
            .get(mainChannel)
            .users.array()
            .map((value) => {
              return value.userName;
            })
            .join("', '") +
          "']}"
      );*/
      resolve();
    });
  })
};

module.exports = {
  name: 'Login Test',
  run: run,
  order: 1,
};
