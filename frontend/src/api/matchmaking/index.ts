import { Request, generateRequest } from '../index';
import { MatchRequest } from 'types/match';

const getCurrentMatchRequestsRequest = () => {
    return generateRequest<MatchRequest[]>(
        Request
            .setUrl('/matchmaking/current')
            .setMethod('get')
    )
    .then(res => res.data);
};

export { getCurrentMatchRequestsRequest };