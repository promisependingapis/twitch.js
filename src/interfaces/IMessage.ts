import { ChannelStructure, UserStructure } from '../structures';
import { ITwitchTags } from './ITwitch';

export interface IMessage {
    content: string;
    toString(): string;
    reply(message: string): void;
    id: string;
    tags: ITwitchTags,
    bits: number,
    channel: ChannelStructure;
    author: UserStructure;
}
