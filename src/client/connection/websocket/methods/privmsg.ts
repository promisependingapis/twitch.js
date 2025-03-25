import { ITwitchMessage, ITwitchUserStateTags, IWSMethodRunCondition } from '../../../../interfaces';
import { Client } from '../../../client';
import { parser } from '../../../../utils';

export class PrivMSG {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public preLoad(): Promise<IWSMethodRunCondition> {
    return Promise.resolve({ command: 'privmsg' });
  }

  public execute(message: ITwitchMessage): Promise<void> {
    return new Promise((resolve) => {
      if (!this.client.channels.has(message.command.channel!)) {
        this.client.channels.addChannel(this.client.channels.generateChannel(message.command.channel!));
      }

      if (!this.client.channels.get(message.command.channel!)?.users.has(message.source!.nick!)) {
        const user = this.client.userManager.generateUserFromTwitch(message.source!.nick!, (message.tags as ITwitchUserStateTags));
        user.channel = this.client.channels.get(message.command.channel!)!;
        this.client.channels.get(message.command.channel!)!.users.addUser(user);
      } else {
        this.client.channels.get(message.command.channel!)!.users.updateUser(message.source!.nick!, (message.tags as ITwitchUserStateTags));
      }

      const parsedMessage = parser.parseFinalMessage(this.client, message);
      this.client._rawEmit('message', parsedMessage);
      resolve();
    });
  }
}
