import { ITwitchMessage, IWSMethodRunCondition } from '../../../../interfaces';
import { Client } from '../../../client';

export default class Pong {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public preLoad(): Promise<IWSMethodRunCondition> {
    return new Promise((resolve) => {
      resolve({
        command: 'join',
      });
    });
  }

  public execute(message: ITwitchMessage): Promise<void> {
    return new Promise((resolve) => {
      if (!this.client.channels.has(message.command.channel)) {
        const channel = this.client.channels.generateChannel(message.command.channel);
        this.client.channels.addChannel(channel);
      }
      const user = this.client.userManager.generateUser(message.source.nick);
      user.channel = this.client.channels.get(message.command.channel);
      this.client.channels.get(message.command.channel).users.addUser(user);
      this.client.rawEmit('join', this.client.channels.get(message.command.channel));
      return resolve();
    });
  }
}
