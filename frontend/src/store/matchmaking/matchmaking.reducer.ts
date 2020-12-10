import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';

import { MatchRequest, NegotiateMatchRequest, MatchFilter } from 'types/match';
import { APIError } from 'api/types';
import { 
    searchMatchRequests, 
    getCurrentMatchRequests, 
    newMatchRequest, 
    receivedMatchNegotiations, 
    removeMatchById,
    resetNegotiating,
} from './matchmaking.actions';

export interface MatchmakingState {
    request: MatchRequest | null,
    negotiating: NegotiateMatchRequest | null,
    filter: MatchFilter;
    requests: MatchRequest[];
    loading: boolean;
    error: APIError<any> | null;//TODO: types
};

export const matchmakingInitialState: MatchmakingState = {
    request: null,
    negotiating: null,
    filter: { playingAs: 'Any', lookingToPlay: 'Any', region: 'Any' },
    requests: [],
    loading: false,
    error: null
};

const matchmaking: Reducer<MatchmakingState> = (state: MatchmakingState = matchmakingInitialState, action) => {
    if (isType(action, searchMatchRequests)) {
        const { payload } = action;

        return {
            ...state,
            filter: payload
        };
    };

    if (isType(action, getCurrentMatchRequests.done)) {
        const { payload } = action;

        return {
            ...state,
            requests: payload.result
        };
    };

    if (isType(action, newMatchRequest)) {
        const { payload } = action;

        return {
            ...state,
            requests: [payload, ...state.requests]
        };
    };

    if (isType(action, receivedMatchNegotiations)) {
        const { payload } = action;

        return {
            ...state,
            negotiating: payload
        }
    }

    if (isType(action, removeMatchById)) {
        const { payload } = action;

        return {
            ...state,
            requests: state.requests.filter(request => request.matchId !== payload)
        }
    }

    if (isType(action, resetNegotiating)) {
        return {
            ...state,
            negotiating: null
        }
    }

    return state;
};

export default matchmaking;