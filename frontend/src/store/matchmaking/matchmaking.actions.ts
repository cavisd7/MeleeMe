import { actionCreatorFactory } from 'typescript-fsa';

import { SocketAction } from '../types';
import { 
    MatchRequest, 
    MatchFilter, 
    NegotiateMatchRequest 
} from 'types/match';
import { APIErrorResponse } from 'api/types';

/* From client to server */
export const CREATE_MATCH_REQUEST = 'matchmaking:CreateMatchRequest';
export const INITIATE_MATCH_NEGOTIATIONS = 'matchmaking:InitiateMatchNegotiations';
export const CONFIRM_MATCH = 'room:ConfirmMatch';
export const DENY_MATCH = 'room:DenyMatch';

/* From server to client */
export const NEW_MATCH_REQUEST = 'NewMatchRequest';
export const REMOVE_MATCH_REQUEST = 'RemoveMatchRequest';
export const RECEIVED_MATCH_NEGOTIATIONS = 'ReceivedMatchNegotiations';
export const MATCH_REQUEST_ACK = 'MatchRequestAck';
export const MATCH_CONFIRMED = 'MatchConfirmed';
export const MATCH_DENIED = 'MatchDenied';

export declare namespace MatchmakingSocketTypes {
    export type CREATE_MATCH_REQUEST = typeof CREATE_MATCH_REQUEST;
    export type NEW_MATCH_REQUEST = typeof NEW_MATCH_REQUEST;
    export type REMOVE_MATCH_REQUEST = typeof REMOVE_MATCH_REQUEST;

    export type INITIATE_MATCH_NEGOTIATIONS = typeof INITIATE_MATCH_NEGOTIATIONS;
    export type RECEIVED_MATCH_NEGOTIATIONS = typeof RECEIVED_MATCH_NEGOTIATIONS;
    export type MATCH_REQUEST_ACK = typeof MATCH_REQUEST_ACK;

    export type CONFIRM_MATCH = typeof CONFIRM_MATCH;
    export type DENY_MATCH = typeof DENY_MATCH;
    export type MATCH_CONFIRMED = typeof MATCH_CONFIRMED;
    export type MATCH_DENIED = typeof MATCH_DENIED;
};

const actionCreator = actionCreatorFactory('@Matchmaking');

export const getCurrentMatchRequests = actionCreator.async<void, MatchRequest[], APIErrorResponse>('GET_CURRENT_MATCH_REQUESTS');

export const createMatchRequest = actionCreator<MatchRequest>(CREATE_MATCH_REQUEST, { isSocketMessage: true });
export const newMatchRequest = actionCreator<MatchRequest>(NEW_MATCH_REQUEST);
export const removeMatchById = actionCreator<string>(REMOVE_MATCH_REQUEST);
export const negotiateMatch = actionCreator<NegotiateMatchRequest>(INITIATE_MATCH_NEGOTIATIONS, { isSocketMessage: true });
export const receivedMatchNegotiations = actionCreator<NegotiateMatchRequest>(RECEIVED_MATCH_NEGOTIATIONS);
export const confirmMatch = actionCreator<{ matchId: string; }>(CONFIRM_MATCH, { isSocketMessage: true });
export const denyMatch = actionCreator<NegotiateMatchRequest>(DENY_MATCH, { isSocketMessage: true });

export const searchMatchRequests = actionCreator<MatchFilter>('SEARCH_MATCH_REQUESTS');
export const resetNegotiating = actionCreator<void>('RESET_NEGOTIATING');
