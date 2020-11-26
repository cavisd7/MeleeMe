import { Request, generateRequest } from '../index';
import { MatchMessagesParams } from './types';
import { Match } from 'types/match';
import { Message } from 'types/message';

const getUsersMatchesRequest = () => {
    return generateRequest<Match[]>(
        Request
            .setUrl('/users/matches')
            .setMethod('get')
    )
    .then(res => res.data);
};

const getMatchMessagesRequest = (params: MatchMessagesParams) => {
    const { matchId, range } = params;

    return generateRequest<Message[]>(
        Request
            .setUrl(`/match/messages/${matchId}?range=${range}`)
            .setMethod('get')
    )
    .then(res => res.data);
};

export { getUsersMatchesRequest, getMatchMessagesRequest };