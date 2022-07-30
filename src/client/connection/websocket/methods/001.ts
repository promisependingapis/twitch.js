import { ITwitchMessage, IWSMethodRunCondition } from '../../../../interfaces';
import { UserStructure } from '../../../../structures';
import { Client } from '../../../client';

export default class Pong {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public preLoad(): Promise<IWSMethodRunCondition> {
    return new Promise((resolve) => {
      resolve({
        command: '001',
      });
    });
  }

  public execute(message: ITwitchMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = message.command;

      if (!command || !command.channel) return reject('No parameters!');

      this.client.getLogger().debug('Logged in successfully as ' + command.channel);

      // Creates user collection
      this.client.user = new UserStructure(this.client, {
        username: command.channel,
        displayName: command.channel,
        id: command.channel,
        self: true,
        moderator: true,
        subscriber: true,
        turbo: false,
        userType: true,
        vip: false,
        staff: false,
        admin: false,
        globalMod: false,
        broadcaster: true,
      });

      this.client.setIsReady(true);
      resolve();
    });
  }
}
