import IORedis from 'ioredis';

import config from '../config';
import { ServerLogger } from '../utils/logging';
import { Client } from './Client';

export interface IPubSub {
    subscribeToChannels (channels: string[] | string): Promise<void>;
    unsubscribeFromChannels (channels: string[] | string): Promise<number>;
    publishToChannel (channel: string, message: string): Promise<number>;
    registerCallback (fn: any): void;
    getSubscriptionCount (): number;
};

export class PubSub extends Client implements IPubSub {
    public subscriptionCount: number;

    private sub;
    private listenerLock: boolean;

    constructor () {
        super();

        /* Redis client from base class acts as pub */
        this.sub = new IORedis(config.redisPort, config.redisHost);
        this.subscriptionCount = 0;

        this.listenerLock = false;
    };
    
    public registerCallback (fn): void {
        if (this.listenerLock) {
            throw new Error('Client already has a listener attached');
        };
        
        this.sub.on('message', (channel, message) => fn(channel, message));

        ServerLogger.info('Successfully registered pubsub message listener. Locking to prevent misuse');
    };

    public async subscribeToChannels (channels: string[]): Promise<void> {
        await this.sub.subscribe([...channels])
            .then(count => this.subscriptionCount = count);
    };

    public async unsubscribeFromChannels (channels: string[] | string): Promise<number> {
        return await this.sub.unsubscribe(...channels);
    };

    //TODO: stringify message here
    public async publishToChannel (channel: string, message: string): Promise<number> {
        return await this.client.publish(channel, message);
    };

    public getSubscriptionCount(): number {
        return this.subscriptionCount;
    };

    private cleanUp(): void {
        this.client.removeAllListeners();
    };
};