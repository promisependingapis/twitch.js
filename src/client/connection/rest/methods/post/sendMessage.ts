import { IExtendedHTTPOptions } from '../../restManager';

interface ISendMessageBody {
  broadcaster_id: string;
  sender_id: string;
  message: string;
  reply_parent_message_id?: string;
  for_source_only?: boolean;
}

export class SendMessage {
  constructor(private options: IExtendedHTTPOptions) {}

  public execute(params: [string, string, string?]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (params.length < 2 || params.length > 3) return reject('Invalid parameters');

      const broadcasterId = params[0];
      const message = params[1];
      const replyParentMessageId = params[2];

      if (!broadcasterId || !message) return reject('Invalid parameters');
      if (!this.options.twitchAPI.clientId) return reject('Twitch API Client ID is not set!');
      if (!this.options.twitchAPI.host) return reject('Twitch API Host is not set!');
      if (!this.options.client.user) return reject('Client must be initialized and authenticated before calling sendMessage');
      if (this.options.client.isAnonymous) return reject('Cannot send messages in anonymous mode!');

      const senderId = this.options.client.user.id;
      if (!senderId) return reject('Authenticated user id is not available');

      let token = this.options.twitchAPI.accessToken;
      if (!token) return reject('Twitch API Access Token is not set!');

      if (token.startsWith('oauth:')) {
        const tmp = token.split(':');
        tmp[0] = 'Bearer';
        token = tmp.join(' ');
      } else if (!token.startsWith('Bearer ')) {
        token = 'Bearer ' + token;
      }

      const endpoint = `${this.options.twitchAPI.host}/chat/messages`;
      const body: ISendMessageBody = {
        broadcaster_id: broadcasterId,
        sender_id: senderId,
        message,
      };

      if (replyParentMessageId) {
        body.reply_parent_message_id = replyParentMessageId;
        body.for_source_only = true;
      }

      fetch(endpoint, {
        method: 'POST',
        headers: {
          ...this.options.http.headers,
          Authorization: token,
          'Client-Id': this.options.twitchAPI.clientId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then(async response => {
        if (!response.ok) {
          return reject(new Error(`Request failed with status ${response.status}`));
        }

        const data = await response.json();
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  }
}
