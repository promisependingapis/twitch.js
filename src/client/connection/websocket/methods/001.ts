import { ITwitchMessage, IWSMethodRunCondition } from '../../../../interfaces';
import { BasicUserStructure } from '../../../../structures';
import { Client } from '../../../client';

export class M001 {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public preLoad(): Promise<IWSMethodRunCondition> {
    return Promise.resolve({ command: '001' });
  }

  public execute(message: ITwitchMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = message.command;

      if (!command || !command.channel) return reject('No parameters!');

      // Creates user collection
      this.client.user = new BasicUserStructure(this.client, {
        username: command.channel,
        id: command.channel,
        self: true,
        userType: true,
        staff: false,
        admin: false,
        globalMod: false,
      });

      resolve();
    });
  }
}
