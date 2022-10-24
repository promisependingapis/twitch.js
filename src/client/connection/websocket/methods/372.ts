import { IWSMethodRunCondition } from '../../../../interfaces';
import { Client } from '../../../client';

export default class M372 {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public preLoad(): Promise<IWSMethodRunCondition> {
    return new Promise((resolve) => {
      resolve({
        command: '372',
      });
    });
  }

  public execute(): void {
    return this.client.getWebSocketManager().pingLoop();
  }
}
