import { ChannelStructure, UserStructure } from '../structures';

export interface IMessage {
    content: string;
    toString(): string;
    reply(message: string): void;
    id: string;
    channel: ChannelStructure;
    author: UserStructure;
}
