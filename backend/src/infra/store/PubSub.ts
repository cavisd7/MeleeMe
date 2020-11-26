import Redis, { Redis as IORedis } from 'ioredis';
//import RedisClient from "./RedisClient";

import { ChannelType } from '../socket/SocketManager';

import config from '../config/index';

export interface IPubSub {
    subscribeToChannels (channels: string[] | string): void;
    unsubscribeFromChannels (channels: string[] | string): Promise<number>;
    //publishToChannel (channel: string, message: string): Promise<number>;
    registerCallback (fn: any): void;
};

export class PubSub implements IPubSub {
    private sub: IORedis;
    public subscribedCount;

    constructor () {
        this.sub = new Redis(Number.parseInt(config.redisPort, 10), config.redisHost);
        this.subscribedCount = 0;
    };
    
    public registerCallback (fn) {
        this.sub.on('message', (channel, message) => fn(channel, message));
    }

    public subscribeToChannels (channels: string[] | string): void {
        //return await this.sub.subscribe(...channels);
        console.log('subing to', channels)
        this.sub.subscribe([...channels], (err, count) => {
            if (err) {
                console.log('error subscribing to channel')
            } else {
                this.subscribedCount = count;
            }
        })
    };

    public async unsubscribeFromChannels (channels: string[] | string): Promise<number> {
        return await this.sub.unsubscribe(...channels);
    };

    /*public async publishToChannel (channel: string, message: string): Promise<number> {
        return await this.client.publish(channel, message);
    };*/
};