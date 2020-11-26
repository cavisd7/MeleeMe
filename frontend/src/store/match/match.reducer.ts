import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';

import { APIError, APIErrorResponse } from 'api/types';
import { Match } from 'types/match';
import { addMatch, getUsersMatches, updateMatchConfirmed, removeMatch } from './match.actions';

export interface MatchState {
    matches: Match[];
    loading: boolean;
    error: APIErrorResponse | null;
};

export const matchInitialState: MatchState = {
    matches: [],
    loading: false,
    error: null
};

const match: Reducer<MatchState> = (state: MatchState = matchInitialState, action) => {
    if (isType(action, addMatch)) {
        return {
            ...state,
            matches: [...state.matches, action.payload]
        }
    };

    if (isType(action, getUsersMatches.started)) {
        return {
            ...state,
            loading: true
        }
    };
    if (isType(action, getUsersMatches.done)) {
        const { result } = action.payload;

        const fixedMatches = result.map((match) => {
            if (match.players.length === 1) {
                const matchCopy = Object.assign({}, match);
                matchCopy.players.push({
                    isOwner: false,
                    netcode: '[deleted]',
                    username: '[deleted]',
                    userId: '[deleted]'
                })

                return matchCopy;
            } else {
                return match;
            }
        })

        return {
            ...state,
            loading: false,
            error: null,
            matches: fixedMatches
        }
    };
    if (isType(action, getUsersMatches.failed)) {
        const { error } = action.payload;

        return {
            ...state,
            loading: false,
            error
        }
    };

    if (isType(action, updateMatchConfirmed)) {
        const { matchId } = action.payload;

        return {
            ...state,
            matches: state.matches.map(match => {
                if (match.matchId === matchId) {
                    match.isConfirmed = true;
                }

                return match;
            })
        }
    }

    if (isType(action, removeMatch)) {
        const { matchId } = action.payload;

        window.location.assign(process.env.NODE_ENV === 'production' ? 'https://meleeme.net/#/messages' : 'http://localhost:3000/#/messages');

        return {
            ...state,
            matches: state.matches.filter(match => match.matchId !== matchId)
        }
    }

    return state;
};

export default match;