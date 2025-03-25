import { ChannelStructure } from './channel';
import { Client } from '../client';

export class BasicUserStructure {
  protected client: Client;
  public username: string;
  public name: string;
  public id: string;
  public premium: boolean;
  public staff: boolean;
  public admin: boolean;
  public globalMod: boolean;
  public self: boolean;
  public haveBadges: boolean;
  public badges: any;
  public userType: boolean;

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

    this.self = data.self ?? (this.client.user?.username === this.username);
  }
}

export class UserStructure extends BasicUserStructure {
  public channel: ChannelStructure;
  public color: string;
  public displayName: string;
  public mod: boolean;
  public subscriber: boolean;
  public turbo: boolean;
  public vip: boolean;
  public broadcaster: boolean;

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
   * @param {Object} Params - the timeout params
   * @param {Number?} Params.seconds - The time in seconds to timeout this user
   * @param {String?} Params.reason - The reason why this user got a timeout
   * @returns {Promise<void>}
   */
  public async timeout({ seconds, reason = '' }: { seconds?: number, reason: string }): Promise<void> {
    return this.client.getWebSocketManager().sendMessage(this.channel.name, `/timeout ${this.username} ${seconds ?? ''} ${reason}`);
  }

  /**
   * @description Remove timeout from user
   * @returns {Promise<void>}
   */
  public async untimeout(): Promise<void> {
    this.client.getWebSocketManager().sendMessage(this.channel.name, `/untimeout ${this.username}`);
  }

  /**
   * @description Ban user on a channel
   * @param {?string} reason - The reason for the ban
   * @returns {Promise<void>}
   */
  public async ban(reason: string = ''): Promise<void> {
    this.client.getWebSocketManager().sendMessage(this.channel.name, `/ban ${this.username} ${reason}`);
  }

  /**
   * @description Remove ban from user
   * @returns {Promise<void>}
   */
  public async unban(): Promise<void> {
    this.client.getWebSocketManager().sendMessage(this.channel.name, `/unban ${this.username}`);
  }
}
