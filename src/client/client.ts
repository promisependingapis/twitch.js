import { IClientOptions } from '../interface/';

export class Client {
  options: IClientOptions;
  constructor(options: IClientOptions) {
    this.options = options;
  }
}
