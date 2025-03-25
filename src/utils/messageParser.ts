import { IMessage, ITwitchMessage, ITwitchCommand, ITwitchTags, ITwitchSource } from '../interfaces';
import { Client } from '../client';

/**
 * @private
 */
export function parseTags(tags: string): ITwitchTags {
  const tagsToIgnore = ['client-nonce', 'flags'];
  const dictParsedTags: any = {};
  tags.split(';').forEach(tag => {
    const parsedTag = tag.split('=');
    const tagValue = parsedTag[1] ?? null;
    switch (parsedTag[0]) {
      case 'badges':
      case 'badge-info':
        if (!tagValue) {
          dictParsedTags[parsedTag[0]] = null;
          break;
        }
        dictParsedTags[parsedTag[0]] = tagValue.split(',').map((pair) => {
          const badgeParts = pair.split('/');
          return { [badgeParts[0]]: badgeParts[1] };
        }).reduce((res, cur) => Object.assign(res, cur));
        break;
      case 'emotes':
        if (!tagValue) {
          dictParsedTags[parsedTag[0]] = null;
          break;
        }
        dictParsedTags[parsedTag[0]] = tagValue.split('/').map((emote) => {
          const emoteParts = emote.split(':');
          const textPositions = emoteParts[1].split(',').map((position) => {
            const positionParts = position.split('-');
            return { startPosition: positionParts[0], endPosition: positionParts[1] };
          });
          return { [emoteParts[0]]: textPositions };
        }).reduce((res, cur) => Object.assign(res, cur));
        break;
      case 'emote-sets':
        dictParsedTags[parsedTag[0]] = tagValue.split(',');
        break;
      default:
        if (!tagsToIgnore.includes(parsedTag[0])) dictParsedTags[parsedTag[0]] = tagValue;
        break;
    }
  });
  return dictParsedTags;
}

/**
 * @private
 */
export function parseCommand(rawCommandComponent: string): ITwitchCommand {
  const commandParts = rawCommandComponent.split(' ');
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
      return {
        command: commandParts[0],
        channel: commandParts[1],
      };
    case 'CAP':
      return {
        command: commandParts[0],
        isCapRequestEnabled: commandParts[2] === 'ACK',
      };
    default:
      return {
        command: commandParts[0],
      };
  }
}

/**
 * @private
 */
export function parseSource(rawSourceComponent: string | null): ITwitchSource | null {
  if (!rawSourceComponent) return null;
  const sourceParts = rawSourceComponent.split('!');
  return {
    host: sourceParts[1] ?? sourceParts[0],
    nick: sourceParts[1] ? sourceParts[0] : undefined,
  };
}

/**
 * @private
 */
export function parseMessage(message: string): ITwitchMessage {
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
    const endIdx = message.indexOf(' ', idx);
    rawSourceComponent = message.slice(idx + 1, endIdx);
    idx = endIdx + 1;
  }

  let endIdx = message.indexOf(':', idx);
  if (endIdx === -1) endIdx = message.length;

  rawCommandComponent = message.slice(idx, endIdx).trim();

  if (endIdx !== message.length) rawParametersComponent = message.slice(endIdx + 1);

  return {
    command: parseCommand(rawCommandComponent),
    tags: rawTagsComponent ? parseTags(rawTagsComponent) : {},
    source: parseSource(rawSourceComponent),
    parameters: rawParametersComponent,
  };
}

/**
 * @private
 */
export function parseFinalMessage(client: Client, message: ITwitchMessage): IMessage | null {
  if (!message.command.channel) return null;
  const channel = client.channels.get(message.command.channel);
  if (!channel) return null;
  const id = message.tags?.id ?? null;
  const parsedMessage: IMessage = {
    content: message.parameters!,
    id,
    tags: message.tags,
    bits: parseInt(message.tags?.bits) ?? 0,
    channel,
    reply: (message: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!message || message.length === 0) {
          return reject('Cannot send empty messages');
        } else if (client.isAnonymous) {
          return reject('Cannot send messages in anonymous mode!');
        }
        client.getWebSocketManager().getConnection()?.send(`@reply-parent-msg-id=${id} PRIVMSG #${channel.name} :${message}`);
        return resolve();
      });
    },
    author: client.channels.get(message.command.channel)!.users.get(message.source!.nick!)!,
    toString(): string {
      return this.content;
    },
  };
  return parsedMessage;
}
