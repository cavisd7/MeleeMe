import React from 'react';
import { RouteComponentProps, Route, Switch, matchPath } from 'react-router-dom';
import Loadable from 'react-loadable';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import SplashScreen from '../../SplashScreen';
import TabLink from '../../core/TabLink';

import { ParsedSlpGames } from '../../../store/parser/types';

const GameStats = Loadable({
    loader: () => import('./GameStats' /* webpackChunkName: "slpParser.gameStats" */),
    loading: () => SplashScreen
});

interface Props {
    games: ParsedSlpGames;
    match: RouteComponentProps<{ id: string }>['match'];
    location: RouteComponentProps['location'];
    history: RouteComponentProps['history'];
};

class SlpMatchAnalyzer extends React.Component<Props, {}> {
    tabs = this.props.games[this.props.match.params.id].map((game, i) => {
        return {
            title: `Game ${i}`,
            href: `${this.props.match.url}/${i}`
        }
    })

    render () {
        const { match, location, games } = this.props;

        const matches = (path: string) => {
            return Boolean(matchPath(path, { path: location.pathname }));
        };

        return (
            <React.Fragment>
                <AppBar style={{ marginBottom: '1rem' }} position="static" color="default" role="tablist">
                    <Tabs
                        value={this.tabs.findIndex(tab => matches(tab.href))}
                    >
                        {
                            this.tabs.map(tab => {
                                return (
                                    <Tab 
                                        key={tab.title}
                                        data-qa-tab={tab.title}
                                        component={React.forwardRef((props, ref) => {
                                            return (
                                                <TabLink
                                                    href={tab.href}
                                                    label={tab.title}
                                                    {...props}
                                                />
                                            );
                                        })}
                                    />
                                )   
                            })
                        }
                    </Tabs>
                </AppBar>
                <Switch>
                    <Route 
                        exact
                        path={`${match.url}/:gameId`}
                        render={props => (
                            <GameStats 
                                game={games[match.params.id][props.match.params.gameId]}
                            />
                        )}
                    />
                </Switch>
            </React.Fragment>
        );
    }
}

export default SlpMatchAnalyzer;