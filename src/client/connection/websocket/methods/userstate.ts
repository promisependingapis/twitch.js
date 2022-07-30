import { ITwitchMessage, ITwitchUserStateTags, IWSMethodRunCondition } from '../../../../interfaces';
import { Client } from '../../../client';

export default class UserState {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public preLoad(): Promise<IWSMethodRunCondition> {
    return new Promise((resolve) => {
      resolve({
        command: 'userstate',
      });
    });
  }

  public execute(message: ITwitchMessage): Promise<void> {
    return new Promise((resolve) => {
      const tags: ITwitchUserStateTags = message.tags as ITwitchUserStateTags;
      const userName: string = message.parameters[0];

      if (this.client.users.has(userName)) {
        this.client.users.updateUser(userName, tags);
        return resolve();
      }

      const user = this.client.users.generateUserFromTwitch(userName, tags);
      this.client.users.addUser(user);
      return resolve();
    });
  }
}
