export interface ITwitchTags {
    [key: string]: any
}

export interface ITwitchSource {
    host: string,
    nick?: string
}

export interface ITwitchCommand {
    command: string,
    channel?: string,
    isCapRequestEnabled?: boolean,
}

export interface ITwitchMessage {
    tags: ITwitchTags,
    source: ITwitchSource,
    command: ITwitchCommand,
    parameters?: string,
}

export interface ITwitchRoomStateTags extends ITwitchTags {
    'emote-only'?: boolean,
    'followers-only'?: number,
    r9k?: boolean,
    rituals?: boolean,
    'room-id'?: number,
    slow?: number,
    'subs-only'?: boolean
}

export interface ITwitchUserStateTags extends ITwitchTags {
    'badge-info'?: boolean,
    badges?: { [key: string]: any },
    color?: string,
    'display-name'?: string,
    'emote-sets'?: string,
    mod?: string,
    subscriber?: string,
    turbo?: string,
    'user-type'?: any, // Enum of i don't know how many options
    'user-id'?: any,
}

export interface ITwitchMultiStateTags extends ITwitchUserStateTags, ITwitchRoomStateTags {}
