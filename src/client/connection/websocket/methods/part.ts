import { ITwitchMessage, IWSMethodRunCondition } from '../../../../interfaces';
import { Client } from '../../../client';

export default class Part {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public preLoad(): Promise<IWSMethodRunCondition> {
    return Promise.resolve({ command: 'part' });
  }

  public execute(message: ITwitchMessage): Promise<void> {
    return new Promise((resolve) => {
      if (this.client.channels.has(message.command.channel)) {
        const channel = this.client.channels.get(message.command.channel);
        channel.connected = false;
        this.client.channels.addChannel(channel);
        this.client.rawEmit('leave', channel);
      }
      return resolve();
    });
  }
}
