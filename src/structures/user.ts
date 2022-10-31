import { ChannelStructure } from './channel';
import { Client } from '../client';

export class BasicUserStructure {
  client: Client;
  username: string;
  name: string;
  id: string;
  premium: boolean;
  staff: boolean;
  admin: boolean;
  globalMod: boolean;
  self: boolean;
  haveBadges: boolean;
  badges: any;
  userType: boolean;

  constructor(client: Client, data: any) {
    this.client = client;

    this.username = data.username;
    this.name = this.username;
    this.id = data.id ? data.id : '';
    this.premium = data.premium ? data.premium : false;
    this.staff = data.staff ? data.staff : false;
    this.admin = data.admin ? data.admin : false;
    this.globalMod = data.globalMod ? data.globalMod : false;
    this.haveBadges = data.haveBadges ? data.haveBadges : false;
    this.badges = data.badges ? data.badges : '';
    this.userType = data.userType ? data.userType : false;

    this.self = data.self ?? this.client.user.username === this.username ?? false;
  }
}

export class UserStructure extends BasicUserStructure {
  channel: ChannelStructure;
  color: string;
  displayName: string;
  mod: boolean;
  subscriber: boolean;
  turbo: boolean;
  vip: boolean;
  broadcaster: boolean;

  constructor(client: Client, data: any) {
    super(client, data);

    this.channel = data.channel;

    this.color = data.color ? data.color : '#FFFFFF';
    this.displayName = data.displayName ? data.displayName : '';
    this.mod = data.mod ? data.mod : false;
    this.subscriber = data.subscriber ? data.subscriber : false;
    this.turbo = data.turbo ? data.turbo : false;
    this.vip = data.vip ? data.vip : false;
    this.broadcaster = data.broadcaster ? data.broadcaster : false;
  }

  /**
   * @description Timeout user on a channel
   * @param {?string} channel - The channel to timeout the user on
   * @param {?number} seconds - The amount of seconds to timeout the user for
   * @param {?string} reason - The reason for the timeout
   * @returns {Promise<void>}
   */
  public async timeout(channel?: string | number, seconds?: number | string, reason?: string): Promise<void> {
    if (typeof channel === 'number') {
      reason = seconds.toString();
      seconds = channel;
    }
    return this.client
      .getWebSocketManager()
      .sendMessage(
        this.channel ? (typeof this.channel === 'string' ? this.channel : this.channel.name) : channel.toString(),
        '/timeout ' + this.username + ' ' + seconds + ' ' + reason,
      );
  }

  /**
   * @description Remove timeout from user
   * @param {string|string[]} channel the channel to untimeout the user on
   * @returns {Promise<void>}
   */
  public async untimeout(channel: string|string[]): Promise<void> {
    if (!channel || !(channel instanceof Array)) {
      if (!channel) channel = this.channel.name;

      return this.client.getWebSocketManager().sendMessage(channel.toString(), `/untimeout ${this.username}`);
    } else {
      channel.forEach((element) => {
        this.client.getWebSocketManager().sendMessage(element, `/untimeout ${this.username}`);
      });
    }
  }

  /**
   * @description Ban user on a channel
   * @param {?string|?Array<string>} channel - The channel to ban the user on
   * @param {?string} reason - The reason for the ban
   * @returns {Promise<void>}
   */
  public async ban(channel: (string | Array<string> | null), reason: string | null): Promise<void> {
    if (!channel || !(channel instanceof Array)) {
      if (!reason) reason = '';

      return this.client
        .getWebSocketManager()
        .sendMessage(
          this.channel ? (typeof this.channel === 'string' ? this.channel : this.channel.name) : channel.toString(),
          '/ban ' + this.username + ' ' + reason,
        );
    } else {
      if (!reason) reason = '';

      channel.forEach((element) => {
        this.client
          .getWebSocketManager()
          .sendMessage(
            element,
            '/ban ' + this.username + ' ' + reason,
          );
      });
    }
  }

  /**
   * @description Remove ban from user
   * @param {string|Array<string>} channel - The channel to unban the user on
   * @returns {Promise<void>}
   */
  public async unban(channel: string|string[]): Promise<void> {
    if (!channel || !(channel instanceof Array)) {
      return this.client
        .getWebSocketManager()
        .sendMessage(
          this.channel ? (typeof this.channel === 'string' ? this.channel : this.channel.name) : typeof channel === 'string' ? channel : channel.join(', '),
          '/unban ' + this.username,
        );
    } else {
      channel.forEach((element) => {
        this.client
          .getWebSocketManager()
          .sendMessage(
            element,
            '/unban ' + this.username,
          );
      });
    }
  }
}
