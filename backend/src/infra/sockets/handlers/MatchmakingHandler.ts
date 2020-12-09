import { Store, PubSub } from '../../store';
import { MatchmakingServiceInstance } from '../../../api/controllers/matchmaking/MatchmakingService';

import { SocketMessage, Channel, Payload, SocketHandler } from '../types';
import { ConfirmMatch, MatchRequest, NegotiateMatchRequest } from '../../types/matchmaking';

export default class MatchmakingHandler implements SocketHandler {
    constructor() {};

    public async exec(action: string, channel: string, payload: any): Promise<void> {
        switch(payload.type) {
            case SocketMessage.CREATE_MATCH_REQUEST:
                return await this.CreateMatchRequest(channel, payload);
            case SocketMessage.CONFIRM_MATCH:
                return await this.ConfirmMatch(channel, payload);
            case SocketMessage.DENY_MATCH:
                return await this.DenyMatch(channel, payload);
            default:
                throw new Error(`[MatchmakingHandler] Unrecognized action ${action}`);
        };
    };

    private async CreateMatchRequest(channel: string, payload: Payload<MatchRequest>): Promise<void> {
        const ttl = 86400;
        const key = `match:${payload.payload.matchId}`;

        await Store.pushList('match_requests', payload.payload.matchId, ttl);
        await Store.setMulHash(key, payload.payload, ttl);

        await PubSub.publishToChannel(channel, JSON.stringify(payload));
    };

    private async ConfirmMatch(channel: string, payload: Payload<ConfirmMatch>): Promise<void> {
        //TODO: rename payload
        await MatchmakingServiceInstance.confirmMatch(payload.payload);

        await PubSub.publishToChannel(channel, JSON.stringify(payload));
    };

    private async DenyMatch(channel: string, payload: Payload<NegotiateMatchRequest>): Promise<void> {
        await PubSub.publishToChannel(channel, JSON.stringify(payload));

        await MatchmakingServiceInstance.refreshMatch(
            payload.payload.matchId, 
            payload.payload.ownerUserId, 
            payload.payload.challengerUserId
        );

        const {
            challengerUserId,
            challengerNetcode,
            challengerUsername,
            ...rest
        } = payload.payload;

        await this.CreateMatchRequest(
            Channel.MATCHES, 
            { 
                type: SocketMessage.CREATE_MATCH_REQUEST, 
                payload: rest 
            }
        );
    };
};