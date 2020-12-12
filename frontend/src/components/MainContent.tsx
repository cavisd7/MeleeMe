import React from 'react';
import { 
    Switch, 
    Route,
    Redirect
} from 'react-router-dom';

import Grid from '@material-ui/core/Grid';

import Loadable from 'react-loadable';

import SplashScreen from './SplashScreen';
import NotFound from './NotFound';
import Footer from './Footer';

const Matchmaking = Loadable({
    loader: () => import('./matchmaking' /* webpackChunkName: "app.matchmaking" */),
    loading: () => SplashScreen
});

const SlpParser = Loadable({
    loader: () => import('./parser/index' /* webpackChunkName: "app.slpParser" */),
    loading: () => SplashScreen
});

const Account = Loadable({
    loader: () => import('./account' /* webpackChunkName: "app.account" */),
    loading: () => SplashScreen
});

const MainContent: React.FC<{}> = (props) => {
    return (
        <React.Fragment>
            <div className='content-full'>
                <main className='main-container'>
                    <Grid container spacing={0} style={{height: '100%'}}>
                        <Grid item xs={12} style={{height: '100%'}}>
                            <Switch>
                                <Route path="/matchmaking" component={Matchmaking} />
                                <Route path="/parser" component={SlpParser} />
                                <Route path="/account" component={Account} />
                                <Redirect exact from="/" to="/matchmaking" />
                                <Route render={({ location }) => <NotFound location={location}/>} />
                            </Switch>
                        </Grid>
                    </Grid>
                </main>
            <Footer />
            </div>
        </React.Fragment>
    );
};

export default MainContent;