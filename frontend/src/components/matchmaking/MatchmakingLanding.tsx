import React from 'react';

import { MatchFilter, MatchRequest, NegotiateMatchRequest, MatchNegotiationPart } from 'types/match';

import Grid from '@material-ui/core/Grid';

import MatchSearch from './SearchMatchRequests/MatchSearch';
import MatchRequestList from './MatchRequests/MatchRequestList';
import { RouteComponentProps } from 'react-router-dom';

interface Props {
    userId: string;
    username: string;
    netcode: string;
    matchRequests: MatchRequest[];
    matchFilter: MatchFilter;
    searchMatchRequestsDispatch: (filter: MatchFilter) => void;
    negotiateMatch: (matchNegotiation: NegotiateMatchRequest) => void;
};

type CombinedProps = Props & RouteComponentProps;

const MatchmakingLanding: React.FC<CombinedProps> = (props) => {
    const { 
        history,
        userId,
        username, 
        netcode,
        matchFilter, 
        matchRequests, 
        searchMatchRequestsDispatch,
        negotiateMatch
    } = props;

    const handleNegotiateMatch = (matchNegotiationPart: MatchNegotiationPart) => {
        const matchNegotiation: NegotiateMatchRequest = Object.assign(
            { 
                challengerUserId: userId,
                challengerUsername: username,
                challengerNetcode: netcode
            },
            matchNegotiationPart
        );

        negotiateMatch(matchNegotiation);

        //history.push(`/messages/${matchNegotiationPart.matchId}`);
    };

    return (
        <React.Fragment>
            <MatchSearch filter={matchFilter} searchMatchRequests={searchMatchRequestsDispatch}/>
            <MatchRequestList 
                loggedInId={userId}
                requests={matchRequests}
                filter={matchFilter}
                negotiateMatch={handleNegotiateMatch}
                history={history}
            />
        </React.Fragment>
    );
}

export default MatchmakingLanding;