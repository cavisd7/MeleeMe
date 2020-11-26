import Redis, { Redis as IORedis } from 'ioredis';
import config from '../config/index';

export interface IRedisClient {
    getHash (key: string): Promise<any>;
    setHash (key: string, values: any, expiresIn: number): Promise<any>;
    delHash (key: string): Promise<number>;
    getInfo (): Promise<string>;

    set (params: any, cb: any): any;
    get (params: any, cb: any): any;
    expire (params: any, cb: any): any;
};

export default class RedisClient implements IRedisClient {
    //protected port = Number.parseInt(config.redisPort, 10);
    //protected host = config.redisHost;
    public client: IORedis;

    constructor () {
        this.client = new Redis(Number.parseInt(config.redisPort, 10), config.redisHost);

        /* TODO: handle failed connection/auto-reconnect */
        this.client.on('error', (err) => {
            console.log('redis error')
            //throw new Error(`Failed to connect to redis`);
        });
    };

    /*public async connect (): Promise<void> {
        await this.client.connect()
            .catch(err => {
                throw new Error(`Could not connecte to redis ${err}`);
            });
    };*/

    private reconnect (times: number): number {
        const delay = Math.min(times * 50, 2000);
        return delay;
    };

    public async getInfo (): Promise<string> {
        return await this.client.info();
    };

    /*for connect-redis */
    public set (params: any, cb: any) {
        console.log('set params', params, cb)
        this.client.set(params, cb);
    };

    /*for connect-redis */
    public get (params: any, cb: any) {
        console.log('get params', params, cb)
        this.client.get(params, cb);
        this.client.expire
    }

    /*for connect-redis */
    public expire (params: any, cb: any) {
        console.log('expire params', params, cb)
        this.client.expire(params, cb)
    }
    
    /*public del () {};
    public mget () {};*/

    public async getHash (key: string): Promise<any> {
        return await this.client.hgetall(key);
    };

    /*  Default expiresIn in seconds, 600 = 10 minutes 
    *   Key format: [domain]:[identifier]
    */
    public async setHash (key: string, values: any, expiresIn: number = 600): Promise<any> {
        return await this.client.multi()
            .hmset(key, values)
            .expire(key, expiresIn)
            .exec()
    };

    public async delHash (key: string): Promise<number> {
        return this.client.del(key);
    };

    public setSession (key: string, values: any, cb: any) {
        return this.client.hmset(key, values, cb);
    };

    public async getSession (key: string, cb: any) {
        /*const session = this.client.hgetall(key, (err, res) => {

            return cb(res)
        });
        return session*/
        //let data;
        await this.client.hgetall(key)
        .then(res => {
            console.log('GOT SESSION', res)
            //data = res;
            /*for (let [key, value] of Object.entries(res)) {
                const [parentKey, childKey] = key.split('.');

            }*/
            return cb(null, res);
        })
        //return this.client.hgetall(key, cb)
    };

    public getAllFromList(key: string): Promise<string[]> {
        return this.client.lrange(key, 0, -1);
    }

    public createPipeline(): Redis.Pipeline {
        return this.client.pipeline();
    }

    public pushList(key: string, element: string, ttl?: number): Promise<any> {
        //return this.client.lpush(key, element)
        return this.client.multi()
            .lpush(key, element)
            .expire(key, ttl | 86400)
            .exec()
    }

    public popList(list: string, count: number, element: string): Promise<number> {
        return this.client.lrem(list, count, element)
    }
};