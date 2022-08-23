import { ITwitchMessage, ITwitchRoomStateTags, IWSMethodRunCondition } from '../../../../interfaces';
import { Client } from '../../../client';

export default class RoomState {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public preLoad(): Promise<IWSMethodRunCondition> {
    return new Promise((resolve) => {
      resolve({
        command: 'roomstate',
      });
    });
  }

  public execute(message: ITwitchMessage): Promise<void> {
    return new Promise((resolve) => {
      const tags: ITwitchRoomStateTags = message.tags as ITwitchRoomStateTags;
      const channelName: string = message.command.channel;

      if (this.client.channels.has(channelName)) {
        this.client.channels.updateChannel(channelName, tags);
        return resolve();
      }

      const channel = this.client.channels.generateChannelFromTwitch(channelName, tags);
      this.client.channels.addChannel(channel);
      return resolve();
    });
  }
}
