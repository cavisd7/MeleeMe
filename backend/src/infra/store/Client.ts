import IORedis, { Redis } from 'ioredis';

import config from '../config/index'
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
    private host: string;
    private port: number;
    public client: Redis;

    constructor() {
        this.host = config.redisHost;
        this.port = config.redisPort;

        this.client = new IORedis(this.port, this.host, { lazyConnect: true });
    };

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

    public getConnectionInfo() {};

    private onConnect () {
        ServerLogger.info('Connected to redis database');
    };

    private onError (err) {
        ServerLogger.error('Redis error');
    };
};