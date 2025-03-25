import { IWSMethodRunCondition } from '../../../../interfaces';
import { Client } from '../../../client';

export class M376 {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public preLoad(): Promise<IWSMethodRunCondition> {
    return Promise.resolve({ command: '376' });
  }

  public execute(): void {
    this.client.setIsReady(true);
    return this.client.getWebSocketManager().pingLoop();
  }
}
