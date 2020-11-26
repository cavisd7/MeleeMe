import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import * as uuid from 'uuid';

import { APIError, APIErrorResponse } from 'api/types';
import { SlpMatchData, ParsedSlpGames } from './types';

import { slpMatchUpload, setParsedSlpGames } from './parser.actions';

export interface ParserState {
    games: ParsedSlpGames | null;
    loading: boolean;
    error: APIErrorResponse | null;
};

export const parserInitialState: ParserState = {
    games: null,
    loading: false,
    error: null,
};

const parser: Reducer<ParserState> = (state: ParserState = parserInitialState, action) => {
    /*if (isType(action, slpMatchUpload.done)) {
        const { result } = action.payload; 
        const setId = uuid.v4();

        return {
            ...state,
            games: { ...state.games, [setId]: result },
            error: null
        }
    }
    if (isType(action, slpMatchUpload.failed)) {
        const { error } = action.payload; 

        return {
            ...state,
            error
        }
    }*/

    if (isType(action, setParsedSlpGames)) {
        const { setId, games } = action.payload;

        return {
            ...state,
            games: {
                [setId]: games
            }
        };
    }

    return state;
};

export default parser;