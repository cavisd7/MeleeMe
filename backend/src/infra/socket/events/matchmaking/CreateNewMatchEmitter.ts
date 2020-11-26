import { BaseEmitter } from "../BaseEmitter";
//import RedisClient from "../../../store/RedisClient";
import Redis from 'ioredis';
import config from '../../../config/index';

type EventName = { create_new_match_request: MatchRequest };

interface MatchRequest {
    matchId: string; 
    ownerUserId: string; 
    ownerUsername: string; 
    ownerNetcode: string; 
    avatar?: string;
    playingAs: string; 
    lookingToPlay: string; 
    region: string; 
    description: string;
}

class CreateNewMatchEmitter extends BaseEmitter<EventName> {
    private static instance: CreateNewMatchEmitter;

    //private store: RedisClient;
    private store;

    private constructor() {
        super();

        this.store = new Redis(Number.parseInt(config.redisPort, 10), config.redisHost);//TODO: redis client management
        this.registerListener();
    };

    public static getInstance(): CreateNewMatchEmitter {
        if (!CreateNewMatchEmitter.instance) {
            CreateNewMatchEmitter.instance = new CreateNewMatchEmitter();
        };
    
        return CreateNewMatchEmitter.instance;
    };

    //TODO: error handling
    private registerListener () {
        this.on('create_new_match_request', (data: MatchRequest) => {
            const { 
                matchId, 
                ownerUserId, 
                ownerUsername, 
                ownerNetcode, 
                playingAs, 
                lookingToPlay, 
                region, 
                description,
                avatar
            } = data;

            const key = `match:${matchId}`;
            const ttl = 86400;

            this.store.multi()
                .lpush('match_requests', matchId)
                .expire('match_requests', ttl)
                .exec()
            
            this.store.multi()
                .hmset(key, {
                    matchId, 
                    ownerUserId, 
                    ownerUsername, 
                    ownerNetcode,
                    avatar, 
                    playingAs, 
                    lookingToPlay, 
                    region, 
                    description
                })
                .expire(key, ttl)
                .exec()

            //this.store.pushList('match_requests', matchId, ttl);
            /*this.store.setHash(key, {
                matchId, 
                ownerUserId, 
                ownerUsername, 
                ownerNetcode, 
                playingAs, 
                lookingToPlay, 
                region, 
                description
            }, ttl);*/
        });
    };
};

export { CreateNewMatchEmitter };