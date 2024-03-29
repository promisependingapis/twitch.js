import { IMessage, ITwitchMessage, ITwitchCommand, ITwitchTags, ITwitchSource } from '../interfaces';
import { Client } from '../client';

// https://dev.twitch.tv/docs/irc/example-parser

/**
 * @private
 */
export function parseTags(tags: string): ITwitchTags {
  const tagsToIgnore: any = {
    'client-nonce': null,
    flags: null,
  };
  const dictParsedTags: any = {};
  const parsedTags = tags.split(';');
  parsedTags.forEach(tag => {
    const parsedTag = tag.split('=');
    const tagValue = parsedTag[1] ?? null;
    switch (parsedTag[0]) {
      case 'badges':
      case 'badge-info':
        if (tagValue) {
          const dict: any = {};
          const badges = tagValue.split(',');
          badges.forEach(pair => {
            const badgeParts = pair.split('/');
            dict[badgeParts[0]] = badgeParts[1];
          });
          dictParsedTags[parsedTag[0]] = dict;
        } else {
          dictParsedTags[parsedTag[0]] = null;
        }
        break;
      case 'emotes':
        if (tagValue) {
          const dictEmotes: any = {};
          const emotes = tagValue.split('/');
          emotes.forEach(emote => {
            const emoteParts = emote.split(':');
            const textPositions: any = [];
            const positions = emoteParts[1].split(',');
            positions.forEach(position => {
              const positionParts = position.split('-');
              textPositions.push({
                startPosition: positionParts[0],
                endPosition: positionParts[1],
              });
            });
            dictEmotes[emoteParts[0]] = textPositions;
          });
          dictParsedTags[parsedTag[0]] = dictEmotes;
        } else {
          dictParsedTags[parsedTag[0]] = null;
        }
        break;
      case 'emote-sets':
        dictParsedTags[parsedTag[0]] = tagValue.split(',');
        break;
      default:
        if (!tagsToIgnore.hasOwnProperty(parsedTag[0])) {
          dictParsedTags[parsedTag[0]] = tagValue;
        }
        break;
    }
  });
  return dictParsedTags;
}

/**
 * @private
 */
export function parseCommand(rawCommandComponent: string): ITwitchCommand {
  let parsedCommand = null;
  var commandParts = rawCommandComponent.split(' ');
  switch (commandParts[0]) {
    case 'JOIN':
    case 'PART':
    case 'NOTICE':
    case 'CLEARCHAT':
    case 'HOSTTARGET':
    case 'PRIVMSG':
    case 'USERSTATE':
    case 'ROOMSTATE':
    case '001':
      parsedCommand = {
        command: commandParts[0],
        channel: commandParts[1],
      };
      break;
    case 'CAP':
      parsedCommand = {
        command: commandParts[0],
        isCapRequestEnabled: commandParts[2] === 'ACK',
      };
      break;
    default:
      parsedCommand = {
        command: commandParts[0],
      };
      break;
  }
  return parsedCommand;
}

/**
 * @private
 */
export function parseSource(rawSourceComponent: string): ITwitchSource {
  if (rawSourceComponent != null) {
    const sourceParts = rawSourceComponent.split('!');
    return {
      host: sourceParts[1] ?? sourceParts[0],
      nick: sourceParts[1] ? sourceParts[0] : null,
    };
  }
  return null;
}

/**
 * @private
 */
export function parseMessage(message: string): ITwitchMessage {
  const parsedMessage: ITwitchMessage = {
    tags: null,
    source: null,
    command: null,
    parameters: null,
  };
  let idx = 0;
  let rawTagsComponent = null;
  let rawSourceComponent = null;
  let rawCommandComponent = null;
  let rawParametersComponent = null;
  if (message[idx] === '@') {
    const endIdx = message.indexOf(' ');
    rawTagsComponent = message.slice(1, endIdx);
    idx = endIdx + 1;
  }
  if (message[idx] === ':') {
    idx += 1;
    const endIdx = message.indexOf(' ', idx);
    rawSourceComponent = message.slice(idx, endIdx);
    idx = endIdx + 1;
  }
  let endIdx = message.indexOf(':', idx);
  if (endIdx === -1) {
    endIdx = message.length;
  }
  rawCommandComponent = message.slice(idx, endIdx).trim();
  if (endIdx !== message.length) {
    idx = endIdx + 1;
    rawParametersComponent = message.slice(idx);
  }
  parsedMessage.command = parseCommand(rawCommandComponent);
  if (parsedMessage.command === null) {
    return null;
  } else {
    if (rawTagsComponent !== null) {
      parsedMessage.tags = parseTags(rawTagsComponent);
    }
    parsedMessage.source = parseSource(rawSourceComponent);
    parsedMessage.parameters = rawParametersComponent;
  }
  return parsedMessage;
}

/**
 * @private
 */
export function parseFinalMessage(client: Client, message: ITwitchMessage): IMessage {
  const channel = client.channels.get(message.command.channel);
  const id = message.tags.id ?? null;
  const parsedMessage: IMessage = {
    content: message.parameters,
    id,
    tags: message.tags,
    bits: parseInt(message.tags.bits) ?? 0,
    channel,
    reply: (message: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!message || message.length === 0) {
          client.getLogger().warn('Cannot send empty messages');
          return reject('Cannot send empty messages');
        } else if (client.isAnonymous) {
          client.getLogger().warn('Cannot send messages in anonymous mode!');
          return reject('Cannot send messages in anonymous mode!');
        }
        client.getWebSocketManager().getConnection().send(`@reply-parent-msg-id=${id} PRIVMSG #${channel.name} :${message}`);
        return resolve();
      });
    },
    author: client.channels.get(message.command.channel).users.get(message.source.nick),
    toString(): string {
      return this.content;
    },
  };
  return parsedMessage;
}
