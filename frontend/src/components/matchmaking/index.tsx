import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import * as uuid from 'uuid';

import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { ApplicationState } from '../../store/index';

import { searchMatchRequests, createMatchRequest, negotiateMatch } from '../../store/matchmaking/matchmaking.actions';
import { getCurrentMatchRequests } from '../../store/matchmaking/matchmaking.requests';

import { MatchRequest, MatchFilter, MatchRequestInput, NegotiateMatchRequest } from 'types/match';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import SplashScreen from '../SplashScreen';
import Navigation from '../Navigation';

const MatchmakingLanding = Loadable({
    loader: () => import('./MatchmakingLanding' /* webpackChunkName: "matchmaking.landing" */),
    loading: () => SplashScreen
});

const CreateMatchRequest = Loadable({
    loader: () => import('./CreateMatchRequest/CreateMatchRequest' /* webpackChunkName: "matchmaking.new" */),
    loading: () => SplashScreen
});

type CombinedProps = StoreProps & DispatchProps & RouteComponentProps;

class Matchmaking extends React.Component<CombinedProps, {}> {
    componentDidMount() {
        this.props.getCurrentMatchRequestsDispatch();
    }

    handleCreateMatchRequest (requestPart: MatchRequestInput) {
        const { 
            userId, 
            username,
            avatar, 
            netcode, 
            createMatchRequestDispatch,
            history
        } = this.props;

        const matchId = uuid.v4();

        const request = Object.assign(requestPart, { 
            matchId,
            ownerUserId: userId, 
            ownerUsername: username,
            ownerNetcode: netcode,
            avatar
        });

        createMatchRequestDispatch(request);

        history.goBack();
    };

    render() {
        const {
            isAuthenticated,
            history,
            location,
            username,
            netcode,
            negotiateMatchDispatch
        } = this.props;

        return(
            <Grid container>
                <Grid item className='space-bottom' xs={12} container justify='space-between' alignItems='center'>
                    <Grid item xs={8}>
                        <Navigation 
                            title='Matchmaking' 
                            pathname={location.pathname} 
                            overrides={[ 
                                { label: 'Matchmaking', position: 0 },  
                                { label: 'New Match Request', position: 1 },  
                            ]}
                        />
                    </Grid>
                    {
                        location.pathname !== '/matchmaking/new' && (
                            <Grid item xs={4} container justify='flex-end'>
                                <Button
                                    disabled={!isAuthenticated}
                                    variant='outlined'
                                    onClick={() => history.push('/matchmaking/new')}
                                >
                                    Request
                                </Button>
                            </Grid>
                        )
                    }
                </Grid>
                <Grid item xs={12}>
                    <Switch>
                        <Route 
                            path='/matchmaking/new' 
                            render={(props) => 
                                <CreateMatchRequest 
                                    {...props}
                                    username={username}
                                    netcode={netcode}
                                    createMatchRequest={(request) => this.handleCreateMatchRequest(request)}
                                />
                            } 
                        />
                        <Route 
                            exact 
                            path='/matchmaking' 
                            render={() => 
                                <MatchmakingLanding 
                                    negotiateMatch={negotiateMatchDispatch} 
                                    {...this.props}
                                />} 
                            />
                        <Route path='*' render={() => <p>404</p>} />
                    </Switch>
                </Grid>
            </Grid>
        );
    };
};

interface StoreProps {
    isAuthenticated: boolean;
    userId: string;
    avatar: string;
    username: string;
    netcode: string;
    matchRequests: MatchRequest[];
    matchFilter: MatchFilter;
};

const mapStateToProps: MapStateToProps<StoreProps, {}, ApplicationState> = state => ({
    isAuthenticated: state.account.isAuthenticated,
    userId: state.account.user?.userId || '',
    avatar: state.account.user?.avatar || '',
    username: state.account.user?.username || '',
    netcode: state.account.user?.netcode || '',
    matchRequests: state.matchmaking.requests,
    matchFilter: state.matchmaking.filter
});

interface DispatchProps {
    searchMatchRequestsDispatch: (filter: MatchFilter) => void;
    createMatchRequestDispatch: (request: MatchRequest) => void;
    getCurrentMatchRequestsDispatch: () => void;
    negotiateMatchDispatch: (matchNegotiation: NegotiateMatchRequest) => void;
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch: ThunkDispatch<ApplicationState, undefined, Action<any>>) => {
    return {
        searchMatchRequestsDispatch: (filter) => dispatch(searchMatchRequests(filter)),
        createMatchRequestDispatch: (request) => dispatch(createMatchRequest(request)),
        getCurrentMatchRequestsDispatch: () => dispatch(getCurrentMatchRequests()),
        negotiateMatchDispatch: (matchNegotiation) => dispatch(negotiateMatch(matchNegotiation))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Matchmaking);