import { ChannelStructure } from './channel';
import { Client } from '../client';

export class UserStructure {
  client: Client;
  channel: ChannelStructure;
  username: string;
  name: string;
  haveBadges: boolean;
  badges: any;
  color: string;
  displayName: string;
  id: string;
  mod: boolean;
  self: boolean;
  subscriber: boolean;
  turbo: boolean;
  userType: boolean;
  vip: boolean;
  staff: boolean;
  admin: boolean;
  globalMod: boolean;
  broadcaster: boolean;

  constructor(client: Client, data: any) {
    this.client = client;

    this.channel = data.channel;

    this.username = data.username;

    this.haveBadges = data.haveBadges ? data.haveBadges : false;
    this.badges = data.badges ? data.badges : '';
    this.color = data.color ? data.color : '#FFFFFF';
    this.displayName = data.displayName ? data.displayName : '';
    this.id = data.id ? data.id : '';
    this.mod = data.mod ? data.mod : false;
    this.subscriber = data.subscriber ? data.subscriber : false;
    this.turbo = data.turbo ? data.turbo : false;
    this.userType = data.userType ? data.userType : false;
    this.vip = data.vip ? data.vip : false;
    this.staff = data.staff ? data.staff : false;
    this.admin = data.admin ? data.admin : false;
    this.globalMod = data.globalMod ? data.globalMod : false;

    this.self = data.self;
    this.broadcaster = data.broadcaster ? data.broadcaster : false;
  }

  /**
     * Timeout user on a channel
     * @param {?string} [channel]
     * @param {?number} [seconds]
     * @param {?string} [reason]
     * @returns {Promise<any>}
     */
  public async timeout(channel, seconds, reason): Promise<void> {
    if (typeof (channel) === 'number') {
      reason = seconds;
      seconds = channel;
    }
    return this.client.getWebSocketManager().sendMessage(
      (this.channel ? (typeof (this.channel) === 'string' ? this.channel : this.channel.name) : channel),
      '/timeout ' + this.username + ' ' + seconds + ' ' + reason);
  }

  /**
     * Remove timeout from user
     * @param {string|Array<string>} [channel]
     * @returns {Promise<any>}
     */
  public async untimeout(channel): Promise<void> {
    if (!channel || !(channel instanceof Array)) {
      if (!channel) channel = this.channel.name;

      return this.client.getWebSocketManager().sendMessage(channel, `/untimeout ${this.username}`);
    } else {
      channel.forEach((element) => {
        this.client.getWebSocketManager().sendMessage(element, `/untimeout ${this.username}`);
      });
    }
  }
}
