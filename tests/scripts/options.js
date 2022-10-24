'use strict';

const expectedOptions = {
  connectionWaitTimeout: 10000,
  loginWaitInterval: 1000,
  loginWaitTimeout: false,
  autoLogEndEnabled: false,
  autoLogEndUncaughtException: true,
  channels: ['arunabot', 'talesgardem', 'lobometalurgico', 'space_interprise'],
  connectedChannels: [],
  debug: true,
  fetchAllChatters: true,
  http: {
    host: 'https://tmi.twitch.tv',
    hostID: 'https://api.promisepending.allonsve.com',
    headers: { 'User-Agent': 'TwitchJsApi/2.0.0' }
  },
  messageCacheLifetime: 60,
  messageCacheMaxSize: 100,
  messageSweepInterval: 10,
  retryInterval: 1000,
  retryLimit: Infinity,
  sync: false,
  syncInterval: 1000,
  ws: { host: 'irc.promisepending.allonsve.com', port: 80, type: 'ws' },
  loggerOptions: {
    defaultLevel: 0,
    prefix: '',
    coloredBackground: false,
    allLineColored: true,
    debug: true,
    disableFatalCrash: true
  },
  prefix: '',
  disableFatalCrash: true
}

const run = (logger, client, channels, mainChannel) => {
  return new Promise((resolve, reject) => {
    const options = client.getOptions();
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
