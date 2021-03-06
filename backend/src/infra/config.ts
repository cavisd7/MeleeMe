import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import NoNodeEnvError from './errors/internal/NoNodeEnvError';
import NoDotenvError from './errors/internal/NoDotenvFile';

const NODE_ENV = process.env.NODE_ENV;

if (!NODE_ENV) {
    throw new NoNodeEnvError();
};

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFile = `.env.${NODE_ENV}`;

console.log(`Using env file: ${dotenvFile}`);

if (fs.existsSync(dotenvFile)) {
    dotenv.config({ path: dotenvFile });
} else {
    throw new NoDotenvError();
};

const appDir = fs.realpathSync(process.cwd());

export default {
    /* SERVER configs */
    serverPort: process.env.SERVER_PORT,
    /* DATADABSE configs */
    dbConfig: {
        type: 'postgres',
        synchronize: true,
        host: process.env.TYPEORM_HOST,
        port: Number.parseInt(process.env.TYPEORM_PORT, 10),
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        entities: [process.env.TYPEORM_ENTITIES], 
        migrations: [process.env.TYPEORM_MIGRATIONS], 
        cli: {
            migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
            entitiesDir: process.env.TYPEORM_ENTITIES_DIR,
        }
    },
    /* REDIS configs */
    redisHost: process.env.REDIS_HOST,
    redisPort: Number.parseInt(process.env.REDIS_PORT, 10),
    /* EXPRESS-SESSION configs */
    expressConfig : {
        sessionConfig: {
            name: process.env.SESSION_COOKIE_NAME,
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: { 
                domain: process.env.NODE_ENV === 'production' && '.meleeme.net',
                proxy: process.env.NODE_ENV === 'production' || false,
                path: '/', 
                httpOnly: false,  
                secure: process.env.NODE_ENV === 'production' || false, 
                sameSite: 'lax', 
                expires: new Date(Date.now() + ((1000 * 60 * 60 * 24) * 7)) //7 days in milliseconds
            }
        },
        corsConfig: {
            //origin: true,
            origin: process.env.BASE_URL.split(','),
            credentials: true,
            //exposedHeaders: ['authorization']
        }
    },
    jwtSecret: process.env.JWT_SECRET,
    /* LOGGER configs */
    combinedLogPath: path.resolve(appDir, 'logs/combined.log'),
    errorLogPath: path.resolve(appDir, 'logs/error.log'),
    logs: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
    },
    aws: {
        region: process.env.REGION,
        credProfile: process.env.CRED_PROFILE,
        profileBucket: process.env.PROFILE_BUCKET,
        parserBucket: process.env.PARSER_BUCKET
    }
};