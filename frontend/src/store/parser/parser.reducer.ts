import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';

import { APIErrorResponse } from 'api/types';
import { ParsedSlpGames } from './types';

import { setParsedSlpGames } from './parser.actions';

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