import { actionCreatorFactory } from 'typescript-fsa';

import { SocketAction } from '../types';

import { 
    MatchRequest, 
    MatchFilter, 
    MatchRequestInput, 
    NegotiateMatchRequest 
} from 'types/match';
import { APIErrorResponse } from 'api/types';

export const CREATE_MATCH_REQUEST = 'CREATE_MATCH_REQUEST';
export const INITIATE_MATCH_NEGOTIATIONS = 'INITIATE_MATCH_NEGOTIATIONS';
export const RECEIVED_MATCH_NEGOTIATIONS = 'RECEIVED_MATCH_NEGOTIATIONS';
export const MATCH_REQUEST_ACK = 'MATCH_REQUEST_ACK';
export const REMOVE_MATCH = 'REMOVE_MATCH';
export const DENY_MATCH = 'DENY_MATCH';
export const CONFIRM_MATCH = 'CONFIRM_MATCH';
export const MATCH_CONFIRMED = 'MATCH_CONFIRMED';
export const MATCH_DENIED = 'MATCH_DENIED';
export const MATCH_DENIED_COMPLETE = 'MATCH_CONFIRMED';
export const MATCH_CONFIRMED_COMPLETE = 'MATCH_CONFIRMED_COMPLETE';

export const DELETE_MATCH_REQUEST = 'DELETE_MATCH_REQUEST';
export const NEW_MATCH_REQUEST = 'NEW_MATCH_REQUEST';
//export const GOT_CURRENT_MATCH_REQUESTS = 'GOT_CURRENT_MATCH_REQUESTS';

export declare namespace MatchmakingSocketTypes {
    export type CREATE_MATCH_REQUEST = typeof CREATE_MATCH_REQUEST;
    export type INITIATE_MATCH_NEGOTIATIONS = typeof INITIATE_MATCH_NEGOTIATIONS;
    export type RECEIVED_MATCH_NEGOTIATIONS = typeof RECEIVED_MATCH_NEGOTIATIONS;
    export type MATCH_REQUEST_ACK = typeof MATCH_REQUEST_ACK;
    export type REMOVE_MATCH = typeof REMOVE_MATCH;
    export type DENY_MATCH = typeof DENY_MATCH;
    export type CONFIRM_MATCH = typeof CONFIRM_MATCH;
    export type MATCH_CONFIRMED = typeof MATCH_CONFIRMED;
    export type MATCH_DENIED = typeof MATCH_DENIED;
    export type MATCH_DENIED_COMPLETE = typeof MATCH_DENIED_COMPLETE;
    export type MATCH_CONFIRMED_COMPLETE = typeof MATCH_CONFIRMED_COMPLETE;

    export type DELETE_MATCH_REQUEST = typeof DELETE_MATCH_REQUEST;
    export type NEW_MATCH_REQUEST = typeof NEW_MATCH_REQUEST;
    //export type GOT_CURRENT_MATCH_REQUESTS = typeof GOT_CURRENT_MATCH_REQUESTS;
};

const actionCreator = actionCreatorFactory('@Matchmaking');

export const getCurrentMatchRequests = actionCreator.async<void, MatchRequest[], APIErrorResponse>('GET_CURRENT_MATCH_REQUESTS');

export const createMatchRequest = actionCreator<MatchRequest>('CREATE_MATCH_REQUEST', { isSocketMessage: true });
export const deleteMatchRequest = actionCreator<string>('DELETE_MATCH_REQUEST', { isSocketMessage: true });

export const newMatchRequest = actionCreator<MatchRequest>('NEW_MATCH_REQUEST');
export const searchMatchRequests = actionCreator<MatchFilter>('SEARCH_MATCH_REQUESTS');

export const negotiateMatch = actionCreator<NegotiateMatchRequest>('INITIATE_MATCH_NEGOTIATIONS', { isSocketMessage: true });
export const receivedMatchNegotiations = actionCreator<NegotiateMatchRequest>('RECEIVED_MATCH_NEGOTIATIONS');
export const removeMatchById = actionCreator<string>('REMOVE_MATCH');

export const denyMatch = actionCreator<NegotiateMatchRequest>('DENY_MATCH', { isSocketMessage: true });
export const confirmMatch = actionCreator<{ matchId: string; }>('CONFIRM_MATCH', { isSocketMessage: true });
/*export const matchConfirmed = actionCreator<{ matchId: string; }>('MATCH_CONFIRMED');
export const matchConfirmedComplete = actionCreator<{ matchId: string; }>('MATCH_CONFIRMED_COMPLETE');

export const matchDenied = actionCreator<{ matchId: string; }>('MATCH_DENIED');
export const matchDeniedComplete = actionCreator<{ matchId: string; }>('MATCH_DENIED_COMPLETE');*/

export const resetNegotiating = actionCreator<void>('RESET_NEGOTIATING');
