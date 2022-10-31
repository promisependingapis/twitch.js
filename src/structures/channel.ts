import { UserManager } from '../client/managers';
import { Client } from '../client';
import { format } from 'util';

export class ChannelStructure {
  client: Client;
  name: string;
  connected: boolean;
  users: UserManager;
  emoteOnly: boolean;
  followersOnly: boolean;
  followersCoolDown: number;
  r9k: boolean;
  rituals: boolean;
  id: number;
  slowMode: boolean;
  slowCoolDown: number;
  subsOnly: boolean;
  self: boolean;

  constructor(client: Client, channelName: string) {
    this.client = client;
    this.name = channelName;
    this.connected = false;
    this.users = new UserManager(client);
    this.emoteOnly = false;
    this.followersOnly = false;
    this.followersCoolDown = -1; // in minutes
    this.r9k = false;
    this.rituals = false;
    this.id = -1;
    this.slowMode = false;
    this.slowCoolDown = 0; // in seconds
    this.subsOnly = false;

    this.self = this.client.user.username === this.name ?? false;
  }

  /**
     * @description Returns if the bot is connected to the channel
     * @returns {boolean} True if the bot is connected to the channel, false if not
     * @example
     * Client.channels.get('channel-id').isConnected();
     */
  isConnected(): boolean {
    return this.connected;
  }

  /**
     * @description Returns the amount of users in the channel
     * @returns {number} The amount of users in the channel
     * @example
     * Client.channels.get('channel-id').getUserCount();
     */
  getUserCount(): number {
    return this.users.cache.size;
  }

  /**
     * @description Sends a message to the channel
     * @param {string} message - The message to send
     * @param {string | string[]} options - The options to send the message with - Like a console.log()
     * @returns {Promise<void>}
     * @example
     * Client.channels.get('channel-id').send('Hello World!');
     */
  send(message: string, options: string[] | string): Promise<void> {
    if (!options) options = '';
    return this.client.getWebSocketManager().sendMessage(this.name, format(message, options));
  }

  /**
   * @description Leaves from the channel
   * @returns {Promise<string>} - The channel name
   */
  leave(): Promise<string> {
    return this.client.leave(this.name);
  }
}
