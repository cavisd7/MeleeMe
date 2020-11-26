import "reflect-metadata";

import Redis from 'ioredis';
import AWS from 'aws-sdk';

import {Server} from './Server';
import { createExpressApp } from './infra/loaders/expressLoader';
import { connectToDb } from './infra/loaders/dbLoader';

/* Load .env variables */
import config from './infra/config';

(async () => {
    try {
        await connectToDb();
        const client: Redis.Redis = new Redis(6379, "redisdb");

        const app = createExpressApp(client);
        const server = new Server(app, client);
        
        server.start();
    } catch (err) {

    }
})();