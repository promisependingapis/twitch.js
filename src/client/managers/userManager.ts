import { ITwitchUserStateTags } from '../../interfaces';
import { BasicUserStructure, UserStructure } from '../../structures';
import { Collection } from '@discordjs/collection';
import { Client } from '..';

export class UserManager {
  public cache: Collection<string, UserStructure>;
  private client: Client;

  constructor(client: Client) {
    this.cache = new Collection<string, UserStructure>();
    this.client = client;
  }

  public get(userName: string): UserStructure {
    return this.cache.get(userName);
  }

  public has(userName: string): boolean {
    return this.cache.has(userName);
  }

  public set(userName: string, user: UserStructure): Collection<string, UserStructure> {
    this.cache.set(userName, user);
    return this.cache;
  }

  public addUser(user: UserStructure): Collection<string, UserStructure> {
    return this.set(user.username, user);
  }

  public generateUser(userName: string): UserStructure {
    return new UserStructure(this.client, { username: userName });
  }

  public generateUserFromTwitch(userName: string, tags: ITwitchUserStateTags): UserStructure {
    const user = new UserStructure(this.client, { username: userName });

    return this.updateFromTags(user, tags);
  }

  public generateBasicUserFromTwitch(userName: string, tags: ITwitchUserStateTags): BasicUserStructure {
    const user = new BasicUserStructure(this.client, { username: userName });

    return this.updateBasicFromTags(user, tags);
  }

  public updateUser(userName: string, tags: ITwitchUserStateTags): UserStructure {
    if (!this.has(userName)) {
      const newUser = this.generateUserFromTwitch(userName, tags);
      this.addUser(newUser);
      return newUser;
    }

    const userOld = this.get(userName);

    const user = this.updateFromTags(userOld, tags);

    this.addUser(user);

    return user;
  }

  public updateFromTags(user: UserStructure, tags: ITwitchUserStateTags): UserStructure {
    user.haveBadges = tags.badges !== null ? Boolean(tags.badges) : user.haveBadges;
    user.badges = tags.badges !== null ? tags.badges : user.badges;
    user.color = tags.color !== null ? tags.color : user.color;
    user.displayName = tags['display-name'] !== null ? tags['display-name'] : user.displayName;
    user.mod = tags.mod !== null ? Number.parseInt(tags.mod) >= 1 : user.mod;
    user.subscriber = tags.subscriber !== null ? Number.parseInt(tags.subscriber) >= 1 : user.subscriber;
    user.turbo = tags.turbo !== null ? Number.parseInt(tags.turbo) >= 1 : user.turbo;
    user.userType = tags['user-type'] !== null ? tags['user-type'] : user.userType;
    user.broadcaster = user.badges.hasOwnProperty('broadcaster');
    user.vip = user.badges.hasOwnProperty('vip');
    user.staff = user.badges.hasOwnProperty('staff');
    user.admin = user.badges.hasOwnProperty('admin');
    user.globalMod = user.badges.hasOwnProperty('global_mod');
    user.premium = user.badges.hasOwnProperty('premium');
    user.id = user.self ? user.id : tags['user-id'] !== null ? tags['user-id'] : user.id;

    return user;
  }

  public updateBasicFromTags(user: BasicUserStructure, tags: ITwitchUserStateTags): BasicUserStructure {
    user.haveBadges = tags.badges !== null ? Boolean(tags.badges) : user.haveBadges;
    user.badges = tags.badges !== null ? tags.badges : user.badges;
    user.userType = tags['user-type'] !== null ? tags['user-type'] : user.userType;
    user.self = user.username === tags.username;
    user.staff = user.badges.hasOwnProperty('staff');
    user.admin = user.badges.hasOwnProperty('admin');
    user.globalMod = user.badges.hasOwnProperty('global_mod');
    user.id = user.self ? user.id : tags['user-id'] !== null ? tags['user-id'] : user.id;

    return user;
  }
}
