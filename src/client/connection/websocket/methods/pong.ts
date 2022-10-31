import { IWSMethodRunCondition } from '../../../../interfaces';
import { Client } from '../../../client';

export default class Pong {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public preLoad(): Promise<IWSMethodRunCondition> {
    return Promise.resolve({ command: 'pong' });
  }

  public execute(): Promise<boolean> {
    return Promise.resolve(this.client.rawEmit('pong'));
  }
}
