import { actionCreatorFactory } from 'typescript-fsa';

import { APIErrorResponse } from 'api/types';
import { SlpMatchData } from './types';

const actionCreator = actionCreatorFactory('@Parser');

export const slpMatchUpload = actionCreator.async<File[], SlpMatchData[], APIErrorResponse>('MATCH_UPLOAD');

export const setParsedSlpGames = actionCreator<{ setId: string; games: SlpMatchData[]; }>('SET_PARSED_SLP_GAMES');
