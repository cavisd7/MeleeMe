import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import { Notifications } from 'types/notification';

import MainNavbar from './MainNavbar';
import SplashScreen from './SplashScreen';
import SideMenu from './SideMenu';

const Chat = Loadable({
    loader: () => import('./chat' /* webpackChunkName: "chat" */),
    loading: () => SplashScreen
});

const MainContent = Loadable({
    loader: () => import('./MainContent' /* webpackChunkName: "app" */),
    loading: () => SplashScreen
});

interface Props {
    username: string;
    netcode: string;
    avatar: string;
    isAuthenticated: boolean;
    notifications: Notifications;
    logoutUser: () => void;
};

const MainWrapper: React.FC<Props> = props => {
    const { 
        username, 
        avatar,
        netcode,
        isAuthenticated, 
        notifications, 
        logoutUser 
    } = props;

    const [menuOpen, toggleMenu] = React.useState<boolean>(false);
    
    return (
        <React.Fragment>
            <MainNavbar  
                username={username}
                netcode={netcode}
                avatar={avatar}
                isAuthenticated={isAuthenticated}
                notifications={notifications}
                logout={logoutUser}
                toggleDrawer={() => toggleMenu(!menuOpen)}
            />
            <div className='app-container'>
                <Switch>
                    <Route path="/messages" component={Chat} />
                    <Route path="/" component={MainContent} />
                </Switch>
            </div>
            <SideMenu 
                isOpen={menuOpen} 
                toggleDrawer={() => toggleMenu(!menuOpen)}
            />
        </React.Fragment>
    );
};

export default MainWrapper;