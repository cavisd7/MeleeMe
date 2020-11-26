import React from 'react';
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';

/* Redux */
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { ApplicationState } from './store/index';

/* Action creators */
import { checkAuthentication } from './store/account/account.actions';
import { connectSocket } from './store/socket/socket.actions';

/* Action request creators */
import { logoutUser } from './store/account/account.requests';
import { getUsersMatches } from './store/match/match.requests';

/* Types */
import { APIError } from 'api/types';
import { User } from 'types/user';
import { Notifications } from 'types/notification';

/* Components */
import MainWrapper from './components/MainWrapper';

type CombinedProps = StoreProps & DispatchProps & RouteComponentProps;

interface ComponentState {};

class App extends React.Component<CombinedProps, ComponentState> {
    constructor (props) {
        super(props);

        this.state = {};
    };

    componentDidMount() {
        if (!this.props.accountLoading) {
            this.props.checkAuthenticationDispatch();
        }

        if (this.props.isAuthenticated) {
            this.props.connectSocketDispatch(process.env.NODE_ENV === 'production' ? 'wss://api.meleeme.net' : 'ws://localhost:4000');
            this.props.getUsersMatchesDispatch();
        };
    };

    componentDidUpdate(prevProps: CombinedProps, prevState: ComponentState) {
        if (!this.props.accountLoading) {
            this.props.checkAuthenticationDispatch();
        }

        if (this.props.isAuthenticated && !prevProps.isAuthenticated && !this.props.isSocketConnected) {
            this.props.connectSocketDispatch(process.env.NODE_ENV === 'production' ? 'wss://api.meleeme.net' : 'ws://localhost:4000');
            this.props.getUsersMatchesDispatch();
        };
    };

    render () {
        const { 
            username, 
            avatar,
            netcode,
            isAuthenticated,
            notifications,
            logoutDispatch,
        } = this.props;

        return (
            <React.Fragment>
                <MainWrapper 
                    username={username}
                    netcode={netcode}
                    avatar={avatar}
                    isAuthenticated={isAuthenticated}
                    notifications={notifications}
                    logoutUser={logoutDispatch}
                />
            </React.Fragment>
        );
    };
};

//props from redux
interface StoreProps {
    isAuthenticated: boolean;
    accountLoading: boolean;
    isSocketConnected: boolean;
    username: string;
    netcode: string;
    avatar: string;
    notifications: Notifications;
};

const mapStateToProps: MapStateToProps<StoreProps, {}, ApplicationState> = state => ({
    isAuthenticated: state.account.isAuthenticated,
    accountLoading: state.account.loading,
    isSocketConnected: state.socket.connected, 
    username: state.account.user?.username || '',
    netcode: state.account.user?.netcode || '',
    avatar: state.account.user?.avatar || '',
    notifications: state.notifications.notifications, //TODO: move?
    /*API Errors */
    //accountError: state.account.error
});

interface DispatchProps {
    checkAuthenticationDispatch: () => void;
    logoutDispatch: () => void;
    connectSocketDispatch: (host: string) => void;
    getUsersMatchesDispatch: () => void;
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch: ThunkDispatch<ApplicationState, undefined, Action<any>>) => {
    return {
        checkAuthenticationDispatch: () => dispatch(checkAuthentication()),
        logoutDispatch: () => dispatch(logoutUser({})), //TODO: fix no params
        connectSocketDispatch: (host) => dispatch(connectSocket(host)),
        getUsersMatchesDispatch: () => dispatch(getUsersMatches())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);