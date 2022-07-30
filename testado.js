const twitch = require('./build/main');

const bot = new twitch.Client({
  autoLogEndEnabled: true,
  loginWaitTimeout: 3000,
  channels: ['test'],
  prefix: 'Abobora',
  debug: true,
});

// bot.start();

bot.on('ready', async () => {
  bot.getLogger().info('The Client is ready!');

  setTimeout(() => {
    bot.getLogger().info(bot.user);
    console.log(bot.user);
  }, 10000);
});

bot.login('oauth:uo7v9nejzd3aqpmtxlek3nau0p3f7v');
