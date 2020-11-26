import React from "react";
import Loadable from 'react-loadable';
import { Switch, Route, Link, RouteComponentProps } from 'react-router-dom';

import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { ApplicationState } from '../../store/index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';

import Navigation from '../Navigation';
import SplashScreen from '../SplashScreen';
import { createSlpMatchUpload } from "src/store/parser/parser.requests";
import { setParsedSlpGames } from "src/store/parser/parser.actions";
import { SlpMatchData, ParsedSlpGames } from "src/store/parser/types";

const SlpFileUpload = Loadable({
    loader: () => import('./FileUpload/SlpFileUpload' /* webpackChunkName: "slpParser.upload" */),
    loading: () => SplashScreen
});

const SlpMatchAnalyzer = Loadable({
    loader: () => import('./MatchAnalyzer/SlpMatchAnalyzer' /* webpackChunkName: "slpParser.slpMatchAnalyzer" */),
    loading: () => SplashScreen
});

interface State {};

type CombinedProps = StoreProps & DispatchProps & RouteComponentProps;

class SlpParser extends React.Component<CombinedProps, State> {
    render() {
        const {
            games, 
            setParsedSlpGamesDispatch 
        } = this.props;

        return (
            <Grid container>
                <Grid item className='space-bottom' xs={12}>
                    <Navigation 
                        title='Parser' 
                        pathname={this.props.location.pathname} 
                        overrides={[ 
                            { label: 'Parser', position: 0 },  
                            { label: 'Parsed Game', position: 1 },  
                        ]}
                    />
                </Grid> 
                <Grid item xs={12}>
                    <Switch>
                        <Route 
                            exact 
                            path='/parser' 
                            render={(props) => 
                                <SlpFileUpload 
                                    history={props.history}
                                    setParsedSlpGames={setParsedSlpGamesDispatch}
                                />
                            }
                        />
                        <Route 
                            path='/parser/:id' 
                            render={(props) => 
                                <SlpMatchAnalyzer 
                                    match={props.match}
                                    location={props.location}
                                    history={props.history}
                                    games={games}
                                />
                            }
                        />
                        <Route 
                            render={(props) => (
                                <p>{props.location.pathname} not found</p>
                               )
                            }
                        />
                    </Switch>
                </Grid>
            </Grid>
        );
    }
}

interface StoreProps {
    games: ParsedSlpGames;
};

const mapStateToProps: MapStateToProps<StoreProps, {}, ApplicationState> = state => ({
    games: state.parser.games
});

interface DispatchProps {
    slpMatchUploadDispatch: (data: any, request: any) => Promise<any>;
    setParsedSlpGamesDispatch: (gameSet: { setId: string; games: SlpMatchData[]; }) => void;
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch: ThunkDispatch<ApplicationState, undefined, Action<any>>) => {
    return {
        slpMatchUploadDispatch: (data, request) => dispatch(createSlpMatchUpload(data, request)(data)),
        setParsedSlpGamesDispatch: (gameSet) => dispatch(setParsedSlpGames(gameSet))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SlpParser);