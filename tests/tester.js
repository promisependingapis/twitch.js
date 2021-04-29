// eslint-disable-next-line strict
'use strict';
const chalk = require('chalk');
var checks = 11;
var actualCheck = 0;

function Logger (Message, type) {
    switch (type) {
        case 'warn':
            console.log(chalk.blueBright('[' + actualCheck + '/' + checks + '] ') + chalk.yellow(Message));
            break;
        case 'sucs':
            actualCheck += 1;
            if (actualCheck > checks) {checks = actualCheck;}
            console.log(chalk.blueBright('[' + actualCheck + '/' + checks + '] ') + chalk.green(Message));
            break;
        case 'err':
            console.log(chalk.blueBright('[' + actualCheck + '/' + checks + '] ') + chalk.red(Message));
            break;
        default:
            console.log(chalk.blueBright('[' + actualCheck + '/' + checks + '] ') + chalk.yellow(Message));
            break;
    }
}

console.log(chalk.yellow('Starting automatizated test...'));
Logger('Loading configs...');

const configs = {
    token: 'oauth:TwitchJSAutomatizedTestFakeIrcToken',
};

Logger('Configs loaded!', 'sucs');
Logger('Loading Twitch.js ...');

try {
    const twitch = require('../src/index.js');

    Logger('Twitch.js loaded!', 'sucs');
    Logger('Creating Twitch.js client...');

    const client = new twitch.Client({
        channels: ['arunabot'],
        debug: true,
        http: {
            hostID: 'https://api.twitchapis.org',
        },
        ws: {
            host: 'irc.twitchapis.org',
            port: '80',
            type: 'ws'
        }
    });

    Logger('Twitch.js client created!', 'sucs');
    Logger('Connecting with twitch...');
    client.login(configs.token).then(() => {
        Logger('Connected with twitch!', 'sucs');
        Logger('Awaiting connect with test channel...');
        client.on('join', continuer);
        function continuer() {
            client.removeListener('join', continuer);
            // eslint-disable-next-line max-len
            client.ws.send('CHATTERS {channel: \'arunabot\', users: [\'' + client.channels.get('arunabot').users.array().map(value => {return value.userName;}).join('\', \'') + '\']}');
            Logger('Connected with test channel!', 'sucs');
            Logger('Connecting with a channel after client be created...');
            client.join('talesgardem').then(async () => {
                // eslint-disable-next-line max-len
                client.ws.send('CHATTERS {channel: \'talesgardem\', users: [\'' + client.channels.get('talesgardem').users.array().map(value => {return value.userName;}).join('\', \'') + '\']}');
                Logger('Connected with channel successfully!', 'sucs');
                Logger('Sending test message on test channels...');
                var sended = 0;
                await client.channels.forEach(channel => {
                    channel.send('[' + Date.now() + '] Automatic test message').then(() => {
                        sended ++;
                    }).catch((err) => {
                        Logger('Error trying to send automatic test message', 'err');
                        Logger(err, 'err');
                        process.exit(1);
                    });
                });
                if (sended === 2) {
                    Logger('Sended test messages!', 'sucs');
                    Logger('Leaving channel...');
                    setTimeout(() => {
                        client.leave('talesgardem').then(async () => {
                            Logger('Disconnected from test channel!', 'sucs');
                            Logger('Sending test message again...');
                            var sended = 0;
                            var nOC = client.channels.array().length;
                            for (var index = 0; index < nOC; index++) {
                            // eslint-disable-next-line no-await-in-loop
                                await client.channels.array()[index].send('[' + Date.now() + '] Message automatic part: 2 test').then(() => {
                                    sended ++;
                                }).catch((err) => {
                                    Logger('Error trying to send message Part: 2!', 'err');
                                    Logger(err, 'err');
                                    process.exit(1);
                                });
                            }
                            if (sended === 1) {
                                Logger('Automatic test message part: 2 sended!', 'sucs');
                                Logger('Getting uptime and finishing up...');
                                client.uptime().then((result) => {
                                    Logger(result + 'ms uptime', 'sucs');
                                    Logger('Disconnecting IRC');
                                    client.disconnect().then(() => {
                                        Logger('Disconnected from IRC', 'sucs');
                                        console.log(chalk.green('All tests passed! :) YAY'));
                                        process.exit(0);
                                    }).catch((err) => {
                                        Logger('Error trying to disconnect from IRC!', 'err');
                                        Logger(err, 'err');
                                        process.exit(1);
                                    });
                                }).catch((err) => {
                                    Logger('Error trying to get uptime!', 'err');
                                    Logger(err, 'err');
                                    process.exit(1);
                                });
                            }
                        }).catch((err) => {
                            Logger('Error trying to disconnect channel', 'err');
                            Logger(err, 'err');
                            process.exit(1);
                        });
                    }, 2500);
                }
            }).catch((err) => {
                Logger('Error trying to join', 'err');
                Logger(err, 'err');
                process.exit(1);
            });
        }
    }).catch((err) => {
        Logger('Error trying to login', 'err');
        Logger(err, 'err');
        process.exit(1);
    });
} catch (e) {
    Logger('Error trying to login', 'err');
    Logger(e, 'err');
    process.exit(1);
}