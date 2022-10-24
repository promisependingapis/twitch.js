import { ChannelStructure } from './channel';
import { Client } from '../client';

export class BasicUserStructure {
  client: Client;
  username: string;
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
   * Timeout user on a channel
   * @param {?string} [channel] the channel to timeout the user on
   * @param {?number} [seconds] the amount of seconds to timeout the user for
   * @param {?string} [reason] the reason for the timeout
   * @returns {Promise<void>}
   */
  public async timeout(channel, seconds, reason): Promise<void> {
    if (typeof channel === 'number') {
      reason = seconds;
      seconds = channel;
    }
    return this.client
      .getWebSocketManager()
      .sendMessage(
        this.channel ? (typeof this.channel === 'string' ? this.channel : this.channel.name) : channel,
        '/timeout ' + this.username + ' ' + seconds + ' ' + reason,
      );
  }

  /**
   * Remove timeout from user
   * @param {string|Array<string>} [channel] the channel to untimeout the user on
   * @returns {Promise<void>}
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

  /**
   * ban user on a channel
   * @param {?string|?Array<string>} [channel] the channel to ban the user on
   * @param {?string} [reason] the reason for the ban
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
   * Remove ban from user
   * @param {string|Array<string>} [channel] the channel to unban the user on
   * @returns {Promise<void>}
   */
  public async unban(channel): Promise<void> {
    if (!channel || !(channel instanceof Array)) {
      return this.client
        .getWebSocketManager()
        .sendMessage(
          this.channel ? (typeof this.channel === 'string' ? this.channel : this.channel.name) : channel,
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
