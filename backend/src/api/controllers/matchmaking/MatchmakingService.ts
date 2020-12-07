import Redis from 'ioredis';
import { getConnection } from 'typeorm';

import { AppLogger, ServerLogger } from '../../../infra/utils/logging';
import config from '../../../infra/config';
import { Store } from '../../../infra/store';

import MatchRepository from '../../../domain/repository/matchmaking/MatchRepository';
import MessageRepository from '../../../domain/repository/message/MessageRepository';
import { UserMatches } from '../../../domain/entity/UserMatches';

import { ConfirmMatch } from '../../../infra/types/matchmaking';
import { MatchRequest, NegotiateMatchRequest } from '../../../domain/types/match';

interface IMatchService {
    createNewMatchRequest (matchRequest: MatchRequest): void;
}

class MatchmakingService implements IMatchService {
    private matchRepository: MatchRepository;
    private messageRepository: MessageRepository;

    //TODO: remove sub client
    constructor () {
        this.matchRepository = getConnection().getCustomRepository(MatchRepository);
        this.messageRepository = getConnection().getCustomRepository(MessageRepository);
    };

    public async createNewMatch (matchRequestNegotions: NegotiateMatchRequest) {
        try {
            const { matchId, ownerUserId, challengerUserId } = matchRequestNegotions;

            await Store.client.lrem('match_requests', 1, matchId)
            await Store.client.del(`match:${matchId}`)

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
            };
        } catch (err) {
            ServerLogger.error('[MatchmakingService] Error creating match');
        };
    };

    public async refreshMatch (matchId: string, ownerUserId: string, challengerUserId: string) {
        const existingMatch = await this.matchRepository.readById(matchId);

        if (existingMatch) {
            const challenger = await UserMatches.findOne({ playerId: challengerUserId });
            await UserMatches.remove(challenger);
            const owner = await UserMatches.findOne({ playerId: ownerUserId });
            await UserMatches.remove(owner);
            
            await this.messageRepository.removeAllByMatch(matchId)
        } else {
            AppLogger.error('[MatchmakingService] Error creating match');

            throw new Error('Error refreshing match. Could not find match');
        };
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

        Store.client.multi()
            .lpush('match_requests', matchId)
            .expire('match_requests', ttl)
            .exec()
        Store.client.multi()
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
    }

    public async confirmMatch (data: ConfirmMatch) {
        const { matchId, ownerId } = data;

        const match = await this.matchRepository.readById(matchId);

        if (!match) {
            AppLogger.error('No matchfound to confirm');

            throw new Error('Could not find match for confirmation');
        };

        const owner = match.playerConnection.filter(val => val.playerId === ownerId)[0];

        if (!owner.isOwner) {
            AppLogger.error('Only match owner can confirm match');

            throw new Error('Only match owner can confirm match');
        };

        await this.matchRepository.updateMatchById(matchId, { isConfirmed: true });
    };
};

const MatchmakingServiceInstance = new MatchmakingService();

export { MatchmakingService, MatchmakingServiceInstance };