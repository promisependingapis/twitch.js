import { IExtendedHTTPOptions } from '../../restManager';
import axios from 'axios';

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

      axios.get(this.options.http.host + path, { headers: this.options.http.headers })
        .then(res => {
          return resolve(res.data);
        }).catch(err => {
          return reject(err);
        });
    });
  }
}
