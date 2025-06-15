import { IExtendedHTTPOptions } from '../../restManager';
import axios from 'axios';

export class Streams {
  constructor(private options: IExtendedHTTPOptions) {}

  public execute(params: [string, string]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (params.length !== 2) return reject('Invalid parameters');
      if (!this.options.twitchAPI.clientId) return reject('Twitch API Client ID is not set!');
      if (!this.options.twitchAPI.host) return reject('Twitch API Host is not set!');
      let token = params[0];
      let channel = params[1];

      if (channel.startsWith('#')) {
        channel = channel.slice(1);
      }

      if (token.startsWith('oauth:')) {
        const tmp = token.split(':');
        tmp[0] = 'Bearer';
        token = tmp.join(' ');
      } else {
        token = 'Bearer ' + token;
      }

      axios.get(this.options.twitchAPI.host + '/streams', {
        headers: {
          ...this.options.http.headers,
          Authorization: token,
          'Client-Id': this.options.twitchAPI.clientId,
        },
        params: {
          user_login: params[1],
        },
      }).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      });
    });
  }
}
