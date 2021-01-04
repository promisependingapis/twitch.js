/* eslint-disable indent */
const WebSocket = require('ws');
const {constants, logger, parser} = require('../utils');
const users = require('../structures/users');
const Channels = require('../structures/channels');
// const Endpoints = constants.Endpoints;

/**
 * @todo Endpoints;
 * @todo remove line 18 eslint disable next line;
 * @todo Inprove case switch of MessageHandler if theres no prefix
 */

class SLEEPTMethods {
  constructor(sleeptMananger) {
    this.sleept = sleeptMananger;
    this.client = sleeptMananger.client;
    this._ackToken = null;
  }

  isConnected() {
    return this.ws !== null && this.ws.readyState === 1;
  }

  login(token) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      if (!token || typeof token !== 'string' || !token.startsWith('oauth:') || token.includes(' ')) {
        reject(constants.errors.INVALID_TOKEN);
        logger.fatal(constants.errors.INVALID_TOKEN);
      }
      this.client.token = token;
      this.userName = 'twitchjs'; // Just to start the connection after that, twitch sends back the bot name and we replace it
      this.id = '';
      this.server = global.twitchApis.client.option.http.host;
      this.ws = new WebSocket(`wss://${this.server}:443`);
      this.ws.onmessage = this.onMessage.bind(this);
      this.ws.onerror = this.onError.bind(this);
      this.ws.onclose = this.onClose.bind(this);
      this.ws.onopen = this.onOpen.bind(this);
      resolve();
    });
  }

  onMessage(event) {
    this.MessageRawSplited = event.data.toString().split('\r\n');
    this.MessageRawSplited.forEach((str) => {
      if (str !== null) {
        this.handlerMessage(parser.Message(str));
      }
    });
  }

  onError(event) {
    logger.fatal(JSON.stringify(event.error));
  }

  onClose() {
    logger.debug('Conection finished ;-;');
  }

  onOpen() {
    var token = this.client.token;
    if (this.ws.readyState !== 1) {
      return;
    }
    this.ready = true;
    logger.debug('Connection Started, Sending auth information...');
    this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
    logger.debug('Sending Password...');
    this.ws.send(`PASS ${token}`);
    logger.debug('Sending Nickname...');
    this.ws.send(`NICK ${this.userName.toLowerCase()}`);
  }

  handlerMessage(messageObject) {
    if (messageObject === null) {
      return;
    }

    // Message Without prefix
    if (messageObject.prefix === null) {
      switch (messageObject.command) {
        // Ping
        case 'PING':
          this.ws.send('PONG');
          break;
        case 'PONG':
          this.client.eventEmmiter('Method.Ping');
          if (!this.pingTimeout) {
            return;
          }
          clearTimeout(this.pingTimeout);
          break;
        default:
          break;
      }
    } else if (messageObject.prefix === 'tmi.twitch.tv') {
      switch (messageObject.command) {
        case '002':
        case '003':
        case '004':
        case '375':
        case '376':
        case 'CAP':
          break;
        case '001':
          this.userName = messageObject.params[0];
          break;
        case '372':
          logger.debug('Connected to the server');
          this.readyAt = Date.now();
          global.twitchApis.client.option.readyAt = this.readyAt;
          this.onConnected();
          this.pingLoop = setInterval(() => {
            if (this.isConnected()) {
              this.ws.send('PING');
            }
            this.latency = new Date();
            this.pingTimeout = setTimeout(() => {
              if (this.ws !== null) {
                this.wasCloseCalled = false;
                logger.error('Ping timeout');
                this.ws.close();

                clearInterval(this.pingLoop);
                clearTimeout(this.pingTimeout);
              }
            }, 9999);
          }, 60000);
          break;
          case 'ROOMSTATE':
            var channel = global.twitchApis.client.channels.get(messageObject.params[0]);
            channel.emoteOnly = messageObject.tags['emote-only'] ? (Number(messageObject.tags['emote-only']) === 1) : channel.emoteOnly;
            channel.followersOnly = messageObject.tags['followers-only'] ? (Number(messageObject.tags['followers-only']) >= 0) : channel.followersOnly;
            channel.followersOnlyCooldown = messageObject.tags['followers-only'] ? (Number(messageObject.tags['followers-only'])) : channel.followersOnlyCooldown;
            channel.r9k = messageObject.tags.r9k ? (Number(messageObject.tags.r9k) === 1) : channel.r9k;
            channel.rituals = messageObject.tags.rituals ? (Number(messageObject.tags.rituals) === 1) : channel.rituals;
            channel.id = messageObject.tags['room-id'] ? (messageObject.tags['room-id']) : channel.id;
            channel.slowMode = messageObject.tags.slow ? (Number(messageObject.tags.slow) >= 1) : channel.slowMode;
            channel.slowCooldown = messageObject.tags.slow ? (Number(messageObject.tags.slow)) : channel.slowCooldown;
            channel.subsOnly = messageObject.tags['subs-only'] ? (Number(messageObject.tags['subs-only']) === 1) : channel.subsOnly;
          break;
          case 'USERSTATE':
            this.updateUser(messageObject);
          break;
          case 'GLOBALUSERSTATE':
            this.id = messageObject.tags['user-id'];
          break;
        default:
          break;
      }
    } else if (messageObject.prefix === this.userName + '.tmi.twitch.tv') {
      switch (messageObject.command) {
        default:
          break;
      }
    } else {
      switch (messageObject.command) {
        case 'JOIN':
          this.client.eventEmmiter('Method.Joined.' + messageObject.params[0]);
          this.client.eventEmmiter('join', global.twitchApis.client.channels.get(messageObject.params[0]));
          if (!global.twitchApis.client.channels.get(messageObject.params[0]).users.get(messageObject.prefix.slice(0, messageObject.prefix.indexOf('!')))) {
            global.twitchApis.client.channels.get(messageObject.params[0]).users.set(
              messageObject.prefix.slice(0, messageObject.prefix.indexOf('!')),
            new users(this.client, {
              userName: messageObject.prefix.slice(0, messageObject.prefix.indexOf('!')), 
              self: messageObject.prefix.slice(0, messageObject.prefix.indexOf('!')) === this.userName})
            );
          }
          break;
        case 'PART':
          if (global.twitchApis.client.channels.get(messageObject.params[0]).users.get(messageObject.prefix.slice(0, messageObject.prefix.indexOf('!')))) {
            global.twitchApis.client.channels.get(messageObject.params[0]).users.delete(messageObject.prefix.slice(0, messageObject.prefix.indexOf('!')));
          }
          this.client.eventEmmiter('Method.Leaved.' + messageObject.params[0]);
          this.client.eventEmmiter('leave', messageObject.params[0]);
          break;
        case 'PRIVMSG':
          this.updateUser(messageObject);
          this.client.eventEmmiter('message', messageObject);
          logger.debug(
            messageObject.params[0] +
              '| ' +
              messageObject.prefix.slice(0, messageObject.prefix.indexOf('!')) +
              ': ' +
              messageObject.params[1]
          );
          break;
        default:
          break;
      }
    }
  }

  onConnected() {
    // Once connected connect the user to the servers he parsed on client inicialization
    global.twitchApis.client.option.channels.forEach((element, index) => {
      setTimeout(() => {
        this.join(element, index);
      }, index * 100);
    });
    this.client.eventEmmiter('ready', this.userName, this.server, '443');
  }

  join(channel, index) {
    return new Promise((resolve, reject) => {
      if (channel.includes(' ')) {
        logger.error(
          'Channel name cannot include spaces: ' + channel + (index ? ', on channels list index: ' + index : '')
        );
        return reject(
          'Channel name cannot include spaces: ' + channel + (index ? ', on channels list index: ' + index : '')
        );
      }
      if (!channel.startsWith('#')) {
        channel = '#' + channel;
      }
      if (global.twitchApis.client.channels.get(channel) && global.twitchApis.client.channels.get(channel).connected === true) {
        logger.warn('Already connected with this channel!');
        return reject('Already connected with this channel!');
      }
      this.ws.send(`JOIN ${channel.toLowerCase()}`);
      logger.debug('Connecting to: ' + channel.toLowerCase());
      this.client.on('Method.Joined.' + channel.toLowerCase(), listener);
      global.twitchApis.client.methods.joinQueueTimeout.push([
        setTimeout(() => {
          reject('Couldn\'t connect with twitch');
        }, 10000),
        channel.toLowerCase(),
      ]);
      function listener() {
        logger.debug('Connected to: ' + channel.toLowerCase());
        if (!global.twitchApis.client.channels.get(channel)) {
          global.twitchApis.client.channels.set(channel, new Channels(this, {channel: channel}));
        }
        global.twitchApis.client.channels.get(channel).connected = true;
        global.twitchApis.client.methods.joinQueueTimeout.forEach((element) => {
          if (element[1] === channel.toLowerCase()) {
            clearTimeout(element[0]);
            return;
          }
        });
        this.removeListener('Method.Joined.' + channel.toLowerCase(), listener);
        resolve(channel);
      }
    });
  }

  leave(channel) {
    return new Promise((resolve, reject) => {
      if (channel.includes(' ')) {
        logger.error('Channel name cannot include spaces: ' + channel);
        return reject('Channel name cannot include spaces: ' + channel);
      }
      if (!channel.startsWith('#')) {
        channel = '#' + channel;
      }
      if (global.twitchApis.client.channels.get(channel.toLowerCase()) && !global.twitchApis.client.channels.get(channel.toLowerCase()).isConnected()) {
        logger.error('Already not connected to the channel: ' + channel);
        return reject('Already not connected to the channel: ' + channel);
      }
      this.ws.send(`PART ${channel.toLowerCase()}`);
      logger.debug('Disconnecting from: ' + channel.toLowerCase());
      this.client.on('Method.Leaved.' + channel.toLowerCase(), listener);
      global.twitchApis.client.methods.leaveQueueTimeout.push([
        setTimeout(() => {
          logger.fatal('Couldn\'t connect with twitch');
          reject('Couldn\'t connect with twitch');
        }, 10000),
        channel.toLowerCase(),
      ]);
      function listener() {
        logger.debug('Disconnected from: ' + channel.toLowerCase());
        if (global.twitchApis.client.channels.get(channel.toLowerCase()) && global.twitchApis.client.channels.get(channel.toLowerCase()).isConnected()) {
          global.twitchApis.client.channels.get(channel.toLowerCase()).connected = false;
        }
        global.twitchApis.client.methods.leaveQueueTimeout.forEach((element) => {
          if (element[1] === channel.toLowerCase()) {
            clearTimeout(element[0]);
            return;
          }
        });
        this.removeListener('Method.Leaved.' + channel.toLowerCase(), listener);
        resolve();
      }
    });
  }

  ping() {
    return new Promise((resolve, reject) => {
      var ping = new Date();
      this.client.on('Method.Ping', listener);
      this.ws.send('PING');
      const pingCommandTimeout = setTimeout(() => {
        logger.fatal('Couldn\'t connect with twitch');
        reject('Couldn\'t connect with twitch');
      }, 20000);
      function listener() {
        this.removeListener('Method.Ping', listener);
        clearTimeout(pingCommandTimeout);
        logger.debug('Pong!');
        ping = new Date() - ping;
        return resolve(ping);
      }
    });
  }

  sendMessage(channel, message, ...replacer) {
    return new Promise((resolve, reject) => {
      if (typeof channel !== 'string') {
        logger.warn('The channel must be a String');
        return reject('The channel must be a String');
      } else if (typeof message !== 'string') {
        logger.warn('The message must be a String');
        return reject('The message must be a String');
      } else if (!message || message === null) {
        logger.warn('Cannot send empty messages');
        return reject('Cannot send empty messages');
      }
      if (replacer && replacer[0]) {
        replacer.forEach((element) => {
          message = message.replace('%s', element);
        });
      }
      if (!channel.includes('#')) {
        channel = '#' + channel;
      }
      resolve(this.ws.send(`PRIVMSG ${channel} :${message}`));
    });
  }

  updateUser(data) {
    if (data.prefix === 'tmi.twitch.tv') data.prefix = this.userName + '!';
    var user = this.client.channels.get(data.params[0]).users.get(data.prefix.slice(0, data.prefix.indexOf('!')));
    if (!user) return;
    user.haveBadges = data.tags['badge-info'] ? !!data.tags['badge-info'] : user.haveBadges;
    user.badges = data.tags.badges ? data.tags.badges : user.badges;
    user.color = data.tags.color ? data.tags.color : user.color;
    user.displayName = data.tags['display-name'] ? data.tags['display-name'] : user.displayName;
    user.hasFlags = data.tags.flags ? data.tags.flags : user.hasFlags;
    user.isMod = data.tags.mod ? Number(data.tags.mod) >= 1 : user.isMod;
    user.isSubscriber = data.tags.subscriber ? (Number(data.tags.subscriber) >= 1) : user.isSubscriber;
    user.isTurbo = data.tags.turbo ? (data.tags.turbo >= 1) : user.isTurbo;
    user.userType = data.tags['user-type'] ? data.tags['user-type'] : user.userType;
    user.self = user.name === this.userName;
    user.broadcaster = user.badges.toString().includes('broadcaster');
    user.id = user.self ? this.id : (data.tags['user-id'] ? data.tags['user-id'] : user.id);
  }
  /*
    logout() {
        return this.rest.makeRequest('post', Endpoints.logout, true, {});
    }
    */
}

module.exports = SLEEPTMethods;
