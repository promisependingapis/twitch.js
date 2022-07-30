import { ITwitchMessage, ITwitchUserStateTags, IWSMethodRunCondition } from '../../../../interfaces';
import { Client } from '../../../client';

export default class GlobalUserState {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public preLoad(): Promise<IWSMethodRunCondition> {
    return new Promise((resolve) => {
      resolve({
        command: 'globaluserstate',
      });
    });
  }

  public execute(message: ITwitchMessage): Promise<void> {
    return new Promise((resolve) => {
      const tags: ITwitchUserStateTags = message.tags as ITwitchUserStateTags;
      const userName: string = message.parameters[0];

      const user = this.client.users.generateUserFromTwitch(userName, tags);
      this.client.user = user;
      return resolve();
    });
  }
}
