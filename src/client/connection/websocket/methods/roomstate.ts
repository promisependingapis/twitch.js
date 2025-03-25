import { ITwitchMessage, ITwitchRoomStateTags, IWSMethodRunCondition } from '../../../../interfaces';
import { Client } from '../../../client';

export class RoomState {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public preLoad(): Promise<IWSMethodRunCondition> {
    return Promise.resolve({ command: 'roomstate' });
  }

  public execute(message: ITwitchMessage): Promise<void> {
    return new Promise((resolve) => {
      const tags: ITwitchRoomStateTags = message.tags as ITwitchRoomStateTags;
      const channelName: string = message.command.channel!.toLowerCase();

      if (this.client.channels.has(channelName)) {
        const channel = this.client.channels.updateChannel(channelName, tags);
        if (!channel.connected) channel.connected = true;
        this.client.channels.addChannel(channel);
        this.client._rawEmit('join', channel);
        return resolve();
      }

      const channel = this.client.channels.generateChannelFromTwitch(channelName, tags);
      channel.connected = true;
      this.client.channels.addChannel(channel);
      this.client._rawEmit('join', channel);
      return resolve();
    });
  }
}
