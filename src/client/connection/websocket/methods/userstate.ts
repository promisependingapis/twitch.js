import { ITwitchMessage, ITwitchUserStateTags, IWSMethodRunCondition } from '../../../../interfaces';
import { Client } from '../../../client';

export default class UserState {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public preLoad(): Promise<IWSMethodRunCondition> {
    return Promise.resolve({ command: 'userstate' });
  }

  public execute(message: ITwitchMessage): Promise<void> {
    return new Promise((resolve) => {
      const tags: ITwitchUserStateTags = message.tags as ITwitchUserStateTags;
      const channelName: string = message.command.channel;

      if (!this.client.channels.has(channelName)) {
        const channel = this.client.channels.generateChannel(channelName);
        this.client.channels.addChannel(channel);
      }

      if (this.client.channels.get(channelName).users.has(tags['display-name'].toLowerCase())) {
        this.client.channels.get(channelName).users.updateUser(tags['display-name'].toLowerCase(), tags);
        return resolve();
      }

      const user = this.client.channels.get(channelName).users.generateUserFromTwitch(tags['display-name'].toLowerCase(), tags);
      user.channel = this.client.channels.get(channelName);
      this.client.channels.get(channelName).users.addUser(user);
      return resolve();
    });
  }
}
