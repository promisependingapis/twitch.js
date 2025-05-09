import { IHTTPOptions } from '../../../../../interfaces/';
import axios from 'axios';

export class TokenValidation {
  private options: IHTTPOptions;
  constructor(options: IHTTPOptions) {
    this.options = options;
  }

  public execute(params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (params.length !== 1) return reject('Invalid parameters');
      let token: any = params[0];

      if (token.startsWith('oauth:')) {
        token = token.split(':');
        token[0] = 'OAuth';
        token = token.join(' ');
      } else {
        token = 'OAuth ' + token;
      }

      axios.get(this.options.hostID + '/oauth2/validate', {
        headers: {
          ...this.options.headers,
          Authorization: token,
        },
      }).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      });
    });
  }
}
