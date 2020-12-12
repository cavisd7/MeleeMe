import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { 
    MatchRequest, 
    MatchFilter, 
    MatchNegotiationPart 
} from 'types/match';

import { Typography, Grid, TableBody } from '@material-ui/core';

import TableWrapper from '../../core/Table/TableWrapper';

import RequestItemRow from './ui/RequestItemRow';
import RequestTableHead from './ui/RequestTableHead';

interface Props {
    requests: MatchRequest[];
    filter: MatchFilter;
    negotiateMatch: (matchNegotiation: MatchNegotiationPart) => void;
    history: RouteComponentProps['history'];
    loggedInId: string; 
};

const MatchRequestList: React.FC<Props> = props => {
    const { requests, filter, negotiateMatch, history, loggedInId } = props;

    const [visibleRequests, setVisibleRequests] = React.useState<MatchRequest[]>(requests);
    const [selectedMatchRequest, setSelectedMatchRequest] = React.useState<string>();

    const collapseRow = (key: string) => {
        key === selectedMatchRequest ? setSelectedMatchRequest('') : setSelectedMatchRequest(key);
    }; 

    const selectRequestForNegotiation = (key: number) => {
        negotiateMatch(requests[key]);
    }

    React.useEffect(() => {
        const matchedResults = props.requests.filter(request => {
            if (
                (filter.lookingToPlay === request.playingAs || request.playingAs === 'Any') 
                && (filter.playingAs === request.lookingToPlay || filter.playingAs === 'Any') 
                && (filter.region === request.region || filter.region === 'Any')
            ) {
                return request;
            }
        });

        setVisibleRequests(matchedResults);
    }, [props.requests, props.filter])

    return (
        <Grid container>
            <Grid item xs={12} container justify='flex-end'>
                <Typography 
                    style={{color: 'rgba(0, 0, 0, 0.30)'}} 
                    variant='subtitle2'
                >
                    {visibleRequests.length} results found for {filter.playingAs} vs {filter.lookingToPlay}
                </Typography>
            </Grid>
            <Grid item xs={12} container>
                <TableWrapper>
                    <RequestTableHead />
                    <TableBody>
                        {
                            visibleRequests.map((request, i) => {
                                return (
                                    <RequestItemRow
                                        loggedInId={loggedInId}
                                        NON_PRODUCTION_key={i}
                                        selected={request.matchId === selectedMatchRequest}
                                        matchId={request.matchId}
                                        userId={request.ownerUserId}
                                        username={request.ownerUsername}
                                        avatar={request.avatar}
                                        netcode={request.ownerNetcode}
                                        playingAs={request.playingAs}
                                        lookingToPlay={request.lookingToPlay}
                                        region={request.region}
                                        description={request.description}
                                        collapseRow={collapseRow}
                                        selectRequestForNegotiation={(key) => selectRequestForNegotiation(key)}
                                    />
                                );
                            })
                        }
                    </TableBody>
                </TableWrapper>
            </Grid>
        </Grid>
    );
};

export default MatchRequestList;