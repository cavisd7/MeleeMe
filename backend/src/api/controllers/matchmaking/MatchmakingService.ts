import { getConnection } from 'typeorm';

import { AppLogger } from '../../../infra/utils/logging';
import { Store } from '../../../infra/store';

import MatchRepository from '../../../domain/repository/matchmaking/MatchRepository';
import MessageRepository from '../../../domain/repository/message/MessageRepository';
import { UserMatches } from '../../../domain/entity/UserMatches';

import { NegotiateMatchRequest, ConfirmMatch } from '../../../types/matchmaking';

interface IMatchService {
    createNewMatch (matchRequestNegotions: NegotiateMatchRequest): Promise<void>;
    refreshMatch (matchId: string, ownerUserId: string, challengerUserId: string): Promise<void>;
    confirmMatch (data: ConfirmMatch): Promise<void>;
};

class MatchmakingService implements IMatchService {
    private MatchRepository: MatchRepository;
    private MessageRepository: MessageRepository;

    constructor() {
        this.MatchRepository = getConnection().getCustomRepository(MatchRepository);
        this.MessageRepository = getConnection().getCustomRepository(MessageRepository);
    };

    public async createNewMatch (matchRequestNegotions: NegotiateMatchRequest): Promise<void> {
        const { matchId, ownerUserId, challengerUserId } = matchRequestNegotions;

        await Store.client.lrem('match_requests', 1, matchId)
        await Store.client.del(`match:${matchId}`)

        const existingMatch = await this.MatchRepository.readById(matchId);

        if (existingMatch) {
            const challenger = await UserMatches.create({ playerId: challengerUserId, matchId, isOwner: false });
            await challenger.save();
        } else {
            await this.MatchRepository.save(matchId, false);
    
            const owner = await UserMatches.create({ playerId: ownerUserId, matchId, isOwner: true});
            await owner.save();
    
            const challenger = await UserMatches.create({ playerId: challengerUserId, matchId, isOwner: false });
            await challenger.save();
        };
    };

    public async refreshMatch (matchId: string, ownerUserId: string, challengerUserId: string): Promise<void> {
        const existingMatch = await this.MatchRepository.readById(matchId);

        if (existingMatch) {
            const challenger = await UserMatches.findOne({ playerId: challengerUserId });
            await UserMatches.remove(challenger);
            const owner = await UserMatches.findOne({ playerId: ownerUserId });
            await UserMatches.remove(owner);
            
            await this.MessageRepository.removeAllByMatch(matchId)
        } else {
            AppLogger.error('[MatchmakingService] Error refreshing match. No match found.');

            throw new Error('Error refreshing match. Could not find match');
        };
    };

    public async confirmMatch (data: ConfirmMatch): Promise<void> {
        const { matchId, ownerUserId } = data;

        const match = await this.MatchRepository.readById(matchId);

        if (!match) {
            AppLogger.error('No match found to confirm');

            throw new Error('Could not find match for confirmation');
        };

        const owner = match.playerConnection.filter(val => val.playerId === ownerUserId)[0];

        if (!owner.isOwner) {
            AppLogger.error('Only match owner can confirm match');

            throw new Error('Only match owner can confirm match');
        };

        await this.MatchRepository.updateMatchById(matchId, { isConfirmed: true });
    };
};

const MatchmakingServiceInstance = new MatchmakingService();

export { MatchmakingService, MatchmakingServiceInstance };