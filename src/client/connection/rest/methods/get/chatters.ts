import { IHTTPOptions } from '../../../../../interfaces/';
import axios from 'axios';

export class GetTokenValidation {
  private options: IHTTPOptions;
  constructor(options: IHTTPOptions) {
    this.options = options;
  }

  public execute(params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (params.length !== 1) return reject('Invalid parameters');
      let channel = params[0];

      if (channel.startsWith('#')) {
        channel = channel.slice(1);
      }

      const path = `/group/user/${channel}/chatters`;

      axios.get(this.options.host + path, { headers: this.options.headers })
        .then(res => {
          return resolve(res.data);
        }).catch(err => {
          return reject(err);
        });
    });
  }
}
