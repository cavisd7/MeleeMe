import { Client } from './Client';

export interface IPubSub {
    subscribeToChannels (channels: string[] | string): Promise<void>;
    unsubscribeFromChannels (channels: string[] | string): Promise<number>;
    publishToChannel (channel: string, message: string): Promise<number>;
    registerCallback (fn: any): void;
};

export class PubSub extends Client implements IPubSub {
    public subscriptionCount;

    constructor () {
        super();

        //connect

        this.subscriptionCount = 0;
    };
    
    public registerCallback (fn) {
        this.client.on('message', (channel, message) => fn(channel, message));
    };

    public async subscribeToChannels (channels: string[]): Promise<void> {
        await this.client.subscribe([...channels])
            .then(count => this.subscriptionCount += count);
    };

    public async unsubscribeFromChannels (channels: string[] | string): Promise<number> {
        return await this.client.unsubscribe(...channels);
    };

    public async publishToChannel (channel: string, message: string): Promise<number> {
        return await this.client.publish(channel, message);
    };

    public getSubscriptionCount() {
        return this.subscriptionCount;
    };
};