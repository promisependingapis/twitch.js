import { IWSMethodRunCondition } from '../../../../interfaces';
import { Client } from '../../../client';

export default class Ping {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public preLoad(): Promise<IWSMethodRunCondition> {
    return new Promise((resolve) => {
      resolve({
        command: 'ping',
      });
    });
  }

  public execute(): Promise<void> {
    return Promise.resolve(this.client.getWebSocketManager().getConnection().send('PONG :tmi.twitch.tv'));
  }
}
