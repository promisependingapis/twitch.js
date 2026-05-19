import { IExtendedHTTPOptions } from '../../restManager';

export class Chatters {
  constructor(private options: IExtendedHTTPOptions) {}

  public execute(params: [string]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (params.length !== 1) return reject('Invalid parameters');
      let channel = params[0];

      if (channel.startsWith('#')) {
        channel = channel.slice(1);
      }

      const path = `/group/user/${channel}/chatters`;

      fetch(this.options.http.host + path, {
        headers: this.options.http.headers,
      }).then(async response => {
        if (!response.ok) {
          return reject(new Error(`Request failed with status ${response.status}`));
        }
        
        const data = await response.json();
        return resolve(data);
      }).catch(err => {
        return reject(err);
      });
    });
  }
}
