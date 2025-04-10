import { ITwitchMessage, ITwitchUserStateTags, IWSMethodRunCondition } from '../../../../interfaces';
import { Client } from '../../../client';

export class GlobalUserState {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public preLoad(): Promise<IWSMethodRunCondition> {
    return Promise.resolve({ command: 'globaluserstate' });
  }

  public execute(message: ITwitchMessage): Promise<void> {
    return new Promise((resolve) => {
      const tags: ITwitchUserStateTags = message.tags as ITwitchUserStateTags;
      const userName: string = tags['display-name']!;

      const user = this.client.userManager.generateBasicUserFromTwitch(userName, tags);
      this.client.user = user;
      return resolve();
    });
  }
}
