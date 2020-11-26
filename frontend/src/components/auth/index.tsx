import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { ApplicationState } from '../../store/index';
import { loginUser, registerUser } from '../../store/account/account.requests';

import { APIErrorResponse } from 'api/types';
import { UserAuthentication, RegistrationInput } from 'api/account/types';

import { 
    Theme, 
    withStyles, 
    WithStyles, 
    createStyles, 
} from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import SplashScreen from '../SplashScreen';

const LoginPage = Loadable({
    loader: () => import('./UserLogin/LoginPage' /* webpackChunkName: "auth.login" */),
    loading: () => SplashScreen
});

const RegistrationPage = Loadable({
    loader: () => import('./UserRegistration/RegistrationPage' /* webpackChunkName: "auth.register" */),
    loading: () => SplashScreen
});

type Classes = 'paper' | 'logo';

const styles = (theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(10, 10)
        },
        logo: {
            padding: theme.spacing(1, 1, 1),
            [theme.breakpoints.down('sm')]: {
                justifyContent: 'center'
            }
        }
    });

interface Props {
    location: RouteComponentProps['location'];
    history: RouteComponentProps['history'];
};

type CombinedProps = Props & ReduxProps & DispatchProps & WithStyles<Classes>;

export class Authentication extends React.Component<CombinedProps, {}> {
    render() {
        const { 
            classes,
            accountError,
            loginUserDispatch,
            registerUserDispatch 
        } = this.props;

        return (
            <div className='auth-page'>
                <div className='auth-main-full'>
                    <Grid className={classes.logo} container justify='flex-start'>
                        <Grid item>
                            <Typography style={{fontWeight: 600, color: '#ee5849'}} variant='h5'>
                                melee.me
                            </Typography>
                        </Grid>
                    </Grid>
                    <Paper className={classes.paper}>
                        <Grid container justify='center'>
                            <Switch>
                                <Route 
                                    path='/auth/login' 
                                    render={(props) => 
                                        <LoginPage 
                                            {...props}
                                            accountError={accountError} 
                                            loginUser={loginUserDispatch}
                                        />} 
                                    />
                                <Route 
                                    path='/auth/register' 
                                    exact
                                    render={(props) => 
                                        <RegistrationPage 
                                            {...props}
                                            accountError={accountError} 
                                            registerUser={registerUserDispatch}
                                        />} 
                                    />
                            </Switch>
                        </Grid>
                    </Paper>
                </div>
            </div>
        );
    };
};

interface ReduxProps {
    accountError: APIErrorResponse | null;
};

const mapStateToProps: MapStateToProps<ReduxProps, {}, ApplicationState> = state => ({
    accountError: state.account.error,
});

interface DispatchProps {
    loginUserDispatch: (authenticationInput: UserAuthentication) => Promise<any>;
    registerUserDispatch: (authenticationInput: RegistrationInput) => Promise<any>; 
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch: ThunkDispatch<ApplicationState, undefined, Action<any>>) => {
    return {
        loginUserDispatch: (authenticationInput) => dispatch(loginUser(authenticationInput)),
        registerUserDispatch: (authenticationInput: RegistrationInput) => dispatch(registerUser(authenticationInput))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Authentication));