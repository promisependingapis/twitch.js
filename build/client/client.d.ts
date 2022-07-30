/// <reference types="node" />
import { IClientOptions, ESteps } from '../interfaces/';
import { ChannelManager, UserManager } from './managers/';
import { WebSocketManager } from './connection/websocket';
import { Logger } from '../utils';
import { RestManager } from './connection/rest';
import { UserStructure } from '../structures';
import EventEmitter from 'events';
export declare class Client extends EventEmitter {
    channels: ChannelManager;
    users: UserManager;
    user: UserStructure;
    private steps;
    private stepManagerStarted;
    private wsManager;
    private restManager;
    private options;
    private tokenVerified;
    private currentStep;
    private isReady;
    private logger;
    private token;
    private readyAt;
    constructor(options: IClientOptions);
    addStepCommand(step: ESteps, callback: () => void): void;
    start(): Promise<void>;
    login(token?: string): void;
    /**
     * @description Set the client options
     * @param [options]: IClientOptions
     * @returns [boolean] - True if the options were set, false otherwise
     * @private
     */
    private setOptions;
    /**
     * Returns the time bot is connected with twitch in milliseconds
     * @returns {Promise<number>}
     * @example
     * await Client.uptime()
     * @example
     * Client.uptime().then((time) => { })
     */
    uptime(): Promise<number>;
    /**
     * @Override
     */
    emit(eventName: string | symbol, ...args: any[]): boolean;
    /**
     * @private
     */
    rawEmit(eventName: string | symbol, ...args: any[]): boolean;
    /**
     * @description Get the logger instance
     * @returns [Logger] - The logger instance
     * @public
     */
    getLogger(): Logger;
    /**
     * @description Get the client options
     * @returns [IClientOptions] - The client options
     * @public
     */
    getOptions(): IClientOptions;
    /**
     * @description Get the REST API Manager Instance
     * @returns [RestManager] - The REST API Manager Instance
     * @public
     */
    getRestManager(): RestManager;
    /**
     * @description Get the WebSocket Manager Instance
     * @returns [WebSocketManager] - The WebSocket Manager Instance
     * @public
     */
    getWebSocketManager(): WebSocketManager;
    /**
     * @private
     */
    setIsReady(isReady: boolean): void;
    private setStep;
    /**
     * @description Get the current client step
     * @returns [ESteps] - The current client step
     * @public
     */
    getCurrentStep(): ESteps;
    private stepManager;
}
//# sourceMappingURL=client.d.ts.map