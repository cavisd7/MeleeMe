import { actionCreatorFactory } from 'typescript-fsa';

import { Message } from 'types/message';
import { Match } from 'types/match';

import { APIErrorResponse } from 'api/types'

export const ADD_MATCH = 'ADD_MATCH';

export declare namespace MatchSocketTypes {
    export type ADD_MATCH = typeof ADD_MATCH;
};

const actionCreator = actionCreatorFactory('@matches');

export const getUsersMatches = actionCreator.async<void, Match[], APIErrorResponse>('GET_USERS_MATCHES');

export const addMatch = actionCreator<Match>('ADD_MATCH');

export const updateMatchConfirmed = actionCreator<{ matchId: string; }>('UPDATE_MATCH_CONFIRMED');
export const removeMatch = actionCreator<{ matchId: string; }>('REMOVE_MATCH');
