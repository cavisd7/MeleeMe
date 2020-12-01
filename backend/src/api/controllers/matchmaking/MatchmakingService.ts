import { getConnection } from 'typeorm';

//import RedisClient from "../../../infra/store/RedisClient";
import MatchRepository from '../../../domain/repository/matchmaking/MatchRepository';

import { MatchRequest, NegotiateMatchRequest } from '../../../domain/types/match';
import { IPubSub } from '../../../infra/store/PubSub';
import { UserMatches } from '../../../domain/entity/UserMatches';
import MessageRepository from '../../../domain/repository/message/MessageRepository';
import Redis from 'ioredis';
import config from '../../../infra/config/index';

interface IMatchService {
    createNewMatchRequest (matchRequest: MatchRequest): void;
}

class MatchmakingService implements IMatchService {
    public store;
    //public store: RedisClient;
    
    //private sub: IPubSub;
    private matchRepository: MatchRepository;
    private messageRepository: MessageRepository;

    //TODO: remove sub client
    constructor () {
        //this.sub = sub;
        this.store = new Redis(config.redisPort, config.redisHost);
        this.matchRepository = getConnection().getCustomRepository(MatchRepository);
        this.messageRepository = getConnection().getCustomRepository(MessageRepository);
    };

    public async createNewMatch (matchRequestNegotions: NegotiateMatchRequest) {
        try {
            const { matchId, ownerUserId, challengerUserId } = matchRequestNegotions;

            await this.store.lrem('match_requests', 1, matchId)
            //await this.store.popList('match_requests', 1, matchId);
            //await this.store.delHash(`match:${matchId}`);
            await this.store.del(`match:${matchId}`)

            const existingMatch = await this.matchRepository.readById(matchId);

            if (existingMatch) {
                const challenger = await UserMatches.create({ playerId: challengerUserId, matchId, isOwner: false });
                await challenger.save();
            } else {
                await this.matchRepository.save(matchId, false);
        
                const owner = await UserMatches.create({ playerId: ownerUserId, matchId, isOwner: true});
                await owner.save();
        
                const challenger = await UserMatches.create({ playerId: challengerUserId, matchId, isOwner: false });
                await challenger.save();
            }
        } catch (err) {
            console.log('error creating match', err)
        }
    };

    public async refreshMatch (data: { matchId: string; ownerUserId: string; challengerUserId: string }) {
        try {
            const { matchId, ownerUserId, challengerUserId } = data;

            const existingMatch = await this.matchRepository.readById(matchId);
            console.log('existing', existingMatch, matchId)

            if (existingMatch) {
                //await this.matchRepository.cleanMatchById(matchId, challengerUserId);
                const challenger = await UserMatches.findOne({ playerId: challengerUserId });
                await UserMatches.remove(challenger);
                const owner = await UserMatches.findOne({ playerId: ownerUserId });
                await UserMatches.remove(owner);
                
                await this.messageRepository.removeAllByMatch(matchId)
            } else {
                console.log('error refreshing match: could not find match')
            }
        } catch (err) {
            console.log('error refreshing match', err)
        }
    };

    public createNewMatchRequest (matchRequest: MatchRequest) {
        const { 
            matchId, 
            ownerUserId, 
            ownerUsername, 
            ownerNetcode, 
            playingAs, 
            lookingToPlay, 
            region, 
            description
        } = matchRequest;

        const key = `match:${matchId}`;
        const ttl = 86400;

        this.store.multi()
            .lpush('match_requests', matchId)
            .expire('match_requests', ttl)
            .exec()
        //this.store.pushList('match_requests', matchId);
        this.store.multi()
            .hmset(key, {
                matchId, 
                ownerUserId, 
                ownerUsername, 
                ownerNetcode, 
                playingAs, 
                lookingToPlay, 
                region, 
                description
            })
            .expire(key, ttl)
            .exec()
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
    }

    public async confirmMatch (data) {
        const { matchId, ownerId } = data;

        console.log('confiming match')
        const match = await this.matchRepository.readById(matchId);

        //TODO: handle
        if (!match) {
            console.log('NO MATCH FOUND')
            return;
        };

        //TODO: temp
        const owner = match.playerConnection.filter(val => val.playerId === ownerId);

        if (!owner[0].isOwner) {
            console.log("NOT MATCH OWNER")
            return;
        } else {
            await this.matchRepository.updateMatchById(matchId, { isConfirmed: true });
        };
    }
};

export { MatchmakingService };