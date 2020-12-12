import React from 'react';
import { render } from 'react-dom';
import { 
    HashRouter,
    Route, 
    Switch 
} from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store/index';

import { 
    ThemeProvider, 
} from '@material-ui/core';
import { theme } from './theme';

import Loadable from 'react-loadable';

import './index.css';
import App from './App';
import SplashScreen from './components/SplashScreen';

const Authentication = Loadable({
    loader: () => import('./components/auth/index'),
    loading: () => SplashScreen
});

render(
    <Provider store={store}>
        <HashRouter>
                <ThemeProvider theme={theme}>
            <Switch>
                <Route exact path="/auth/*" 
                    render={ (props) => 
                        <Authentication 
                            location={props.location} 
                            history={props.history}
                        /> 
                } />
                <Switch>
                        <Route render={(props) => <App {...props} />} />
                </Switch>
            </Switch>
                    </ThemeProvider>
        </HashRouter>
    </Provider>, 
document.getElementById('root'));

if (module.hot) {
    module.hot.accept();
};