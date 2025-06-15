import { IExtendedHTTPOptions } from '../../restManager';
import axios from 'axios';

export class TokenValidation {
  constructor(private options: IExtendedHTTPOptions) {}

  public execute(params: [string]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (params.length !== 1) return reject('Invalid parameters');
      let token = params[0];

      if (token.startsWith('oauth:')) {
        const tmp = token.split(':');
        tmp[0] = 'OAuth';
        token = tmp.join(' ');
      } else {
        token = 'OAuth ' + token;
      }

      axios.get(this.options.http.hostID + '/oauth2/validate', {
        headers: {
          ...this.options.http.headers,
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
