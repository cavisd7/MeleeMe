import { Store } from 'express-session';
import RedisClient from "./RedisClient";

//TODO: type res.session
export default function (session) {
    const Store = session.Store;

    class RedisSessionStore extends Store {
        public client: RedisClient;
        public prefix: string;
        public ttl: number;

        constructor (client: RedisClient) {
            super();

            if (!client) {
                throw new Error('A redis client must be provided for session store.');
            };

            this.prefix = 'session';
            this.client = client;
            this.ttl = 604800; //TTL for a session in redis, 7 days in seconds
        }

        //TODO: callbacks?
        public async get (sid, cb) {
            const key = `${this.prefix}:${sid}`;

            this.client.getSession(key, cb);
        };

        public set (sid, session, cb) {
            const key = `${this.prefix}:${sid}`;
            let flatSession;

            //TODO: session middleware error handling
            try {
                flatSession = this._flatten(session);
                console.log('flat', flatSession)
            } catch (err) {
                return cb(err)
            };

            //TODO: set expiration
            this.client.setSession(key, flatSession, cb)
        };

        /**
         *  'cookie.path': '/',
            'cookie.originalMaxAge': 604800000,
            'cookie.httpOnly': true,
            'cookie.secure': false,
            'cookie.sameSite': true,
            'user.userId': '35df692b-db06-4956-96db-1c55781652db',
            'user.username': 'kc',
            'user.email': 'kc@gmail.com',
            'user.netcode': 'KC#787',
            'user.matchIds.0': '8bfcf228-5b02-4d97-b18c-2f0b5eae49ef',
            'user.matchIds.1': '451455c6-6eb9-43d6-b588-30efa778b0c7'
         */

        /*Credit: https://stackoverflow.com/questions/54896928/flattening-the-nested-object-in-javascript */
        private _flatten (obj, prefix: string = '', flat = {}): any {
            return Object.entries(obj).reduce((acc, [key, value]) => {
                const nKey = `${prefix}${key}`;
                if (value instanceof Date) {
                    console.log('found date at', nKey)
                    flat[nKey] = value.getTime();
                } else if (typeof value === 'object') {
                    this._flatten(value, `${nKey}.`, acc)
                } else {
                    flat[nKey] = value;
                };

                return acc;
            }, flat);
        };

        public async destroy(sid, cb) {
            const key = `${this.prefix}:${sid}`;
            await this.client.delHash(key);
        };
    };
    
    return RedisSessionStore;
};