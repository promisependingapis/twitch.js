'use strict';

const expectedOptions = {
  connectionWaitTimeout: 10000,
  loginWaitInterval: 1000,
  loginWaitTimeout: false,
  autoLogEndEnabled: false,
  autoLogEndUncaughtException: true,
  channels: [],
  connectedChannels: [],
  debug: true,
  fetchAllChatters: true,
  http: { hostID: 'https://api.promisepending.allonsve.com' },
  messageCacheLifetime: 60,
  messageCacheMaxSize: 100,
  messageSweepInterval: 10,
  retryInterval: 1000,
  retryLimit: Infinity,
  sync: false,
  syncInterval: 1000,
  ws: { host: 'irc.promisepending.allonsve.com', port: 80, type: 'ws' },
  loggerOptions: {
    coloredBackground: false,
    allLineColored: true,
  },
  prefix: '',
  disableFatalCrash: true
}

const run = (logger, client, channels, mainChannel) => {
  return new Promise((resolve, reject) => {
    const options = client.getOptions();
    expectedOptions.channels = [mainChannel];
    const isEqual = JSON.stringify(options) === JSON.stringify(expectedOptions);
    if (isEqual) {
      resolve();
    } else {
      reject('Options are not equal');
    }
  });
};

module.exports = {
  name: 'Options Test',
  run: run,
  order: 0,
};
