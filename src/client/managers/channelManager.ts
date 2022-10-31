import { ITwitchRoomStateTags } from '../../interfaces';
import { ChannelStructure } from '../../structures';
import { Collection } from '@discordjs/collection';
import { Client } from '..';

export class ChannelManager {
  public cache: Collection<string, ChannelStructure>;
  private client: Client;

  constructor(client: Client) {
    this.client = client;
    this.cache = new Collection<string, ChannelStructure>();
  }

  /**
   * @description Returns a channel from the cache
   * @param {string} channelName - The name of the channel
   * @returns {ChannelStructure} - The channel
   */
  public get(channelName: string): ChannelStructure {
    if (channelName.startsWith('#')) channelName = channelName.substring(1);
    return this.cache.get(channelName);
  }

  /**
   * @description Checks if a channel is in the cache
   * @param {string} channelName - The name of the channel
   * @returns {boolean} - If the channel exists in the cache returns true, else false
   */
  public has(channelName: string): boolean {
    if (channelName.startsWith('#')) channelName = channelName.substring(1);
    return this.cache.has(channelName);
  }

  /**
   * @description Sets a channel in the cache
   * @param {string} channelName - The name of the channel
   * @param {ChannelStructure} channel - The channel to set
   * @returns {Collection<string, ChannelStructure>} - The updated cache
   */
  public set(channelName: string, channel: ChannelStructure): Collection<string, ChannelStructure> {
    this.cache.set(channelName, channel);
    return this.cache;
  }

  /**
   * @description Adds a channel to the cache
   * @param {string} channel - The name of the channel
   * @returns {Collection<string, ChannelStructure>} - The updated cache
   */
  public addChannel(channel: ChannelStructure): Collection<string, ChannelStructure> {
    return this.set(channel.name, channel);
  }

  /**
   * @private
   */
  public generateChannel(channelName: string): ChannelStructure {
    if (channelName.startsWith('#')) channelName = channelName.substring(1);
    return new ChannelStructure(this.client, channelName);
  }

  /**
   * @private
   */
  public generateChannelFromTwitch(channelName: string, tags: ITwitchRoomStateTags): ChannelStructure {
    if (channelName.startsWith('#')) channelName = channelName.substring(1);
    const channelBase = new ChannelStructure(this.client, channelName);

    return this.updateFromTags(channelBase, tags);
  }

  /**
   * @private
   */
  public updateChannel(channelName: string, tags: ITwitchRoomStateTags): ChannelStructure {
    if (channelName.startsWith('#')) channelName = channelName.substring(1);
    if (!this.has(channelName)) {
      const newChannel = this.generateChannelFromTwitch(channelName, tags);
      this.addChannel(newChannel);
      return newChannel;
    }

    const channelOld = this.get(channelName);

    const channel = this.updateFromTags(channelOld, tags);

    this.set(channelName, channel);

    return channel;
  }

  private updateFromTags(channel: ChannelStructure, tags: ITwitchRoomStateTags): ChannelStructure {
    channel.emoteOnly = tags['emote-only'] !== null ? tags['emote-only'] : channel.emoteOnly;
    channel.followersOnly = tags['followers-only'] !== null ? tags['followers-only'] >= 0 : channel.followersOnly;
    channel.followersCoolDown = tags['followers-only'] !== null ? tags['followers-only'] : channel.followersCoolDown;
    channel.r9k = tags.r9k !== null ? tags.r9k : channel.r9k;
    channel.rituals = tags.rituals !== null ? tags.rituals : channel.rituals;
    channel.id = tags['room-id'] !== null ? tags['room-id'] : channel.id;
    channel.slowMode = tags.slow !== null ? tags.slow >= 1 : channel.slowMode;
    channel.slowCoolDown = tags.slow !== null ? tags.slow : channel.slowCoolDown;
    channel.subsOnly = tags.subs !== null ? tags.subs : channel.subsOnly;

    return channel;
  }
}
