import { IExtendedHTTPOptions } from '../../restManager';

export class TokenValidation {
  constructor(private options: IExtendedHTTPOptions) {}

  public execute(params: [string]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (params.length !== 1) return reject('Invalid parameters');
      const token = 'OAuth ' + params[0].replace(/^oauth:/i, '');

      fetch(this.options.http.hostID + '/oauth2/validate', {
        headers: {
          ...this.options.http.headers,
          Authorization: token,
        },
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
