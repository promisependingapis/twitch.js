// eslint-disable-next-line strict
'use strict';

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const { Utils, Client } = require(path.resolve(__dirname, '..', 'build'));
const loggerClass = Utils.Logger;
const channels = ['arunabot', 'talesgardem', 'lobometalurgico', 'space_interprise'];

const mainChannel = channels[Math.floor(Math.random() * channels.length)];

var testFailed = false;

var actualCheck = 0;

var checks = 0;

const client = new Client({
  channels: channels,
  loginWaitTimeout: false,
  debug: true,
  loggerOptions: {
    coloredBackground: false,
    allLineColored: true,
  },
  disableFatalCrash: true,
  http: {
    hostID: 'https://api.promisepending.allonsve.com',
  },
  ws: {
    host: 'irc.promisepending.allonsve.com',
    port: 80,
    type: 'ws'
  }
});

const logger = new loggerClass({
  debug: true,
  coloredBackground: false,
  allLineColored: true,
  prefix: 'Tester',
  disableFatalCrash: true
});

const scriptDir = path.resolve(__dirname, 'scripts');

const tests = [];

async function runTests() {
  for (var i = 0; i <= checks - 1; i++) {
    actualCheck = i + 1;
    logger.info(`Starting test: "${chalk.blueBright(tests[i].name)}" [${actualCheck}/${checks}]`);

    await tests[i].run(logger, client, channels, mainChannel, i).catch((e) => {
      logger.warn(`Error on test: "${chalk.yellow(tests[i].name)}". Error: ${e}`);
      testFailed = true;
    });
  }
}

async function run() {
  logger.info('Starting tests...');

  const files = fs.readdirSync(scriptDir);

  const jsFile = files.filter((f) => f.split('.').pop() === 'js');

  if (jsFile.length <= 0) {
    return logger.fatal('No Tests found!');
  }

  files.forEach((file) => {
    const eventFunction = require(`${scriptDir}/${file}`);
    logger.info(`=> ${chalk.blueBright(eventFunction.name)}`);
    tests.push(eventFunction);
  });

  tests.sort((a, b) => a.order - b.order);
  checks = tests.length;
  await client.start();
  await runTests();
  if (testFailed) {
    logger.error('1 or more tests failed. Please check what happened.');
    return process.exit(1);
  }
  logger.info('Tests successfully completed!');
}

run();
