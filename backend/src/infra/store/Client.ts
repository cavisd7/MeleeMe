import IORedis, { Redis as RedisClient } from 'ioredis';

import config from '../config'
import { ServerLogger } from '../utils/logging';

interface ClientConfig {
    host: string;
    port: number;
};

interface IClient {
    connect: () => void;
    getConnectionInfo: () => any;
};

export class Client implements IClient {
    public client: RedisClient;

    private host: string;
    private port: number;
    
    static readonly ttl = 86400;

    constructor() {
        this.host = config.redisHost;
        this.port = config.redisPort;

        this.client = new IORedis(this.port, this.host, { lazyConnect: true });
    };

    //TODO: handle failed connect and reconnect
    public connect(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            ServerLogger.info(`Attempting to connect to redis database @${this.host}:${this.port}...`);

            await this.client.connect()
                .then(() => {
                    ServerLogger.info(`Connected to redis database @ ${this.host}:${this.port} successfully`);
                    resolve(this.client);
                })
                .catch(err => {
                    return reject(new Error('Could not establish a connection to redis db'));
                });
        });
    };

    public async setMulHash(key: string, values: object, ttl?: number): Promise<any> {
        return await this.client.multi()
            .hmset(key, values)
            .expire(key, ttl | Client.ttl)
            .exec();
    };

    public async pushList(key: string, value: string, ttl?: number): Promise<any>  {
        return await this.client.multi()
            .lpush(key, value)
            .expire(key, ttl | Client.ttl)
            .exec()
    };

    public getConnectionInfo() {};

    private onConnect () {
        ServerLogger.info('Connected to redis database');
    };

    private onError (err) {
        ServerLogger.error('Redis error');
    };
};