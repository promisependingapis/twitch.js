/* eslint-disable max-len */
/*
    TwitchApis | Twitch.JS
    Example: ChatBot
    Description: A chatbot with a web dashboard (localhost)
*/
const { Client, logger } = require('../../src/index');
const configs = require('../../../configs.json'); // Change this to your config file path
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const router = require('./src/routes');

const port = 3000;

app.use(router);

http.listen(port, () => {
    logger.info('listening on localhost:' + port);
});

/*
    Twitch connection and socket comunication
*/

var TwitchConnected = false;
var botName = '';
const twitch = new Client({
    debug: true,
    channels: ['space_interprise', 'lobometalurgico'],
    autoLogEnd: true,
});

twitch.on('ready', (botname) => {
    logger.info('Connected with twitch');
    TwitchConnected = true;
    botName = botname;
});

function getActiveChannels() {
    var connectedChannels = [];
    twitch.channels.array().forEach((channel) => {
        if (channel.connected) {
            connectedChannels.push(channel);
        }
    });
    return connectedChannels;
}

io.on('connection', socket => {
    socket.on('Load', () => {
        socket.emit('StatusUpdate', TwitchConnected ? JSON.stringify({Text: 'Connected', Color: '#AAFFAA'}) : JSON.stringify({Text: 'Waiting connection', Color: '#FFFF55'}));
        twitch.on('ready', () => {socket.emit('StatusUpdate', JSON.stringify({Text: 'Connected', Color: '#AAFFAA'}));});
        twitch.on('message', (message) => {socket.emit('TwitchChatMessage', message);});
        socket.emit('ChatChannels', JSON.stringify(getActiveChannels()));
        twitch.on('join', () => {socket.emit('ChatChannels', JSON.stringify(getActiveChannels()));});
        socket.on('SendMessage', (Data) => {
            twitch.channels.get(Data.selectedChannel).send(Data.content).then(() => {
                socket.emit('TwitchChatMessage', {
                    author: twitch.channels.get(Data.selectedChannel).users.find(collection => collection.name === botName),
                    channel: twitch.channels.get(Data.selectedChannel),
                    content: Data.content
                });
            });
        });
        socket.on('ConnectToChannel', (Data) => {twitch.join(Data.channelName).then(() => {socket.emit('ConnectToChannelResponse', JSON.stringify({name: Data.channelName}));}).catch((err) => {socket.emit('ConnectToChannelResponse', JSON.stringify({error: JSON.stringify(err.toString())}));});});
        socket.on('LeaveOfChannel', (Data) => {twitch.leave(Data.channelName).then(() => {socket.emit('LeaveOfChannelResponse', JSON.stringify({name: Data.channelName}));}).catch((err) => {socket.emit('ConnectToChannelResponse', JSON.stringify({error: JSON.stringify(err.toString())}));});});
    });
});

twitch.login(configs.Token); // Login us with twitch