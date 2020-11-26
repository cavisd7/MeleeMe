import React from 'react';
import { Switch, Route, matchPath, RouteComponentProps } from 'react-router-dom';
import Loadable from 'react-loadable';

import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { ApplicationState } from '../../store/index';

import { APIErrorResponse } from 'api/types';
import { User } from 'types/user';
import { updateAccount, deleteAccount, updatePassword } from '../../store/account/account.requests';
import { UpdateAccountParams, DeleteAccountParams, UpdatePasswordParams } from 'api/account/types';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabLink from '../core/TabLink';

import SplashScreen from '../SplashScreen';
import Navigation from '../Navigation';
import { updateAvatar } from 'src/store/account/account.actions';

const AccountOverview = Loadable({
    loader: () => import('./AccountOverview/AccountOverview'),
    loading: () => SplashScreen
});

type CombinedProps = StoreProps & DispatchProps & RouteComponentProps;

interface State {};

class Account extends React.Component<CombinedProps, State> {
    constructor (props) {
        super(props);
    };

    tabs = [
        {
            title: 'Account',
            href: '/account'
        }
    ]

    matches = (path: string) => {
        return Boolean(matchPath(path, { path: location.pathname }));
    };

    render() {
        const { 
            user,
            accountError,
            updateAccountDispatch,
            deleteAccountDispatch,
            updatePasswordDispatch,
            updateAvatarDispatch
        } = this.props;

        return (
            <React.Fragment>
                <Navigation 
                    title='Account' 
                    pathname={this.props.location.pathname} 
                    overrides={[ 
                        { label: 'Manage Account', position: 0 },  
                    ]}
                />
                <AppBar position="static" color="default" role="tablist">
                    <Tabs
                        value={this.tabs.findIndex(tab => this.matches(tab.href))}
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
                        path='/account' 
                        exact 
                        render={(props) => 
                            <AccountOverview 
                                {...props} 
                                user={user} 
                                accountError={accountError}
                                updateAccount={updateAccountDispatch}
                                deleteAccount={deleteAccountDispatch}
                                updatePassword={updatePasswordDispatch}
                                updateAvatar={updateAvatarDispatch}
                            />
                        } 
                    />
                    <Route path='*' render={() => <p>404</p>} />
                </Switch>
            </React.Fragment>
        );
    };
};

interface StoreProps {
    user: User;
    accountError: APIErrorResponse;
    username: string;
    email: string;
    netcode: string;
};

const mapStateToProps: MapStateToProps<StoreProps, {}, ApplicationState> = state => ({
    user: state.account.user,
    accountError: state.account.error,
    username: state.account.user.username,
    email: state.account.user.email,
    netcode: state.account.user.netcode,
});

interface DispatchProps {
    updateAccountDispatch: (user: UpdateAccountParams) => Promise<any>;
    updatePasswordDispatch: (updatePasswordParams: UpdatePasswordParams) => Promise<any>;
    deleteAccountDispatch: (deleteAccountParams: DeleteAccountParams) => Promise<any>;
    updateAvatarDispatch: (avatar: string) => void; 
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch: ThunkDispatch<ApplicationState, undefined, Action<any>>) => {
    return {
        updateAccountDispatch: (user) => dispatch(updateAccount(user)),
        deleteAccountDispatch: (deleteAccountParams) => dispatch(deleteAccount(deleteAccountParams)),
        updatePasswordDispatch: (updatePasswordParams) => dispatch(updatePassword(updatePasswordParams)),
        updateAvatarDispatch: (avatar) => dispatch(updateAvatar(avatar))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);