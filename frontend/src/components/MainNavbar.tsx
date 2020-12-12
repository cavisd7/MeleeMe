import React from 'react';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';

import { 
    Theme,
    makeStyles, 
    Grid,
    Button, 
    AppBar, 
    Toolbar, 
    Typography,
    Avatar, 
    Hidden,
    IconButton,
} from '@material-ui/core'

import MenuIcon from '@material-ui/icons/Menu';
import EmailIcon from '@material-ui/icons/Email';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import DropDownMenu from 'core/DropDownMenu';
import { MenuItem } from './core/CustomMenuItem';
import CustomMenuList from './core/CustomMenuList';
import { Notifications } from 'types/notification';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: '#f27e73',
        boxShadow: 'none',
        zIndex: 2301
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    avatarSmall: {
        width: theme.spacing(3.0),
        height: theme.spacing(3.0),
    },
    paper: {   
        minWidth: '128px',
        boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.2), 1px 5px 8px 0px rgba(0,0,0,0.14), 1px 1px 14px 0px rgba(0,0,0,0.12)',
    },
    menuList: {
        margin: theme.spacing(0, 1),
        padding: theme.spacing(0.5, 0)
    },
    popper: {
        zIndex: 2300
    },
    navItem: {
        maxHeight: '34px',
    },
    navLink: {
        color: '#fff',
        '&:hover': {
            color: 'rgba(255, 255, 255, 0.7)'
        }
    },
    navLinkActive: {
        color: '#fff',
        '&:hover': {
            color: 'rgba(255, 255, 255, 0.7)'
        }
    },
    endIcon: {
        marginLeft: 0
    }
}));

interface NavLink {
    name: string;
    to: string;
    key: string;
};

interface _MenuItem extends MenuItem {
    condition: boolean;
};

interface Props extends RouteComponentProps {
    username: string;
    netcode: string;
    avatar: string;
    isAuthenticated: boolean;
    notifications: Notifications;
    logout: () => void;
    toggleDrawer: () => void;
};

const Navbar: React.FC<Props> = (props) => {
    const { 
        history, 
        username, 
        netcode,
        avatar,
        isAuthenticated,
        logout,
        toggleDrawer 
    } = props;

    const navLinks: NavLink[] = [
        {
            name: 'Matchmaking',
            to: '/matchmaking',
            key: 'matchmaking',
        },
        {
            name: 'Parser',
            to: '/parser',
            key: 'parser',
        }
    ];
    
    const classes = useStyles();
    
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuAnchor = React.useRef(null);
    
    const handleToggleMenu = () => {
        setIsMenuOpen((prevOpen) => !prevOpen)
    };
    
    const toLogin = () => {
        history.push('/auth/login');
    };

    const createMenuItems = () => {
        const allMenuItems: _MenuItem[] = [
            {
                key: 'messages',
                name: 'Messages',
                condition: isAuthenticated, 
                linkTo: '/messages',
                icon: < EmailIcon/>,
                onClick: (_) => { 
                    setIsMenuOpen(!isMenuOpen) 
                }
            },
            {
                key: 'account',
                name: 'Settings',
                condition: isAuthenticated, 
                linkTo: '/account',
                icon: <SettingsIcon />,
                onClick: (_) => { 
                    setIsMenuOpen(!isMenuOpen) 
                }
            },
            {
                key: 'auth',
                name: 'Logout',
                condition: true,
                icon: <ExitToAppIcon />,
                onClick: (_) => { 
                    logout();
                    setIsMenuOpen(!isMenuOpen) 
                }
            },
        ]

        return allMenuItems.filter(menuItem => menuItem.condition === true);
    };

    return (
        <React.Fragment>
            <AppBar className={classes.root} position='fixed'>
                <Toolbar className={classes.toolbar} variant="dense">
                    <Grid 
                        container 
                        spacing={2} 
                        alignItems="center"
                        justify="space-between"
                    >
                        <Grid 
                            item 
                            xs={8} 
                            container 
                            spacing={2} 
                            alignItems="center" 
                        >
                            <Grid item>
                                <Typography variant='h6'><strong>melee.me</strong></Typography>
                            </Grid>
                            <Hidden smDown>
                                {
                                    navLinks.map(link => {
                                        return (
                                            <Grid item className={classes.navItem}>
                                                <Link 
                                                    style={{ textDecoration: 'none', fontWeight: 600 }}
                                                    to={link.to}
                                                    key={link.key}
                                                >
                                                    <Typography 
                                                        className={props.location.pathname === link.to ? classes.navLinkActive : classes.navLink}
                                                        style={{fontWeight: 600}}
                                                        variant='subtitle2' 
                                                    >
                                                        { link.name }
                                                    </Typography>
                                                </Link>
                                            </Grid>
                                        );
                                    })
                                }
                            </Hidden>
                            <Hidden mdUp>
                                <IconButton
                                    color="inherit"
                                    aria-label="open menu"
                                    disableFocusRipple
                                    disableTouchRipple
                                    onClick={toggleDrawer}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Hidden>
                        </Grid>
                        <Grid 
                            item 
                            xs={4} 
                            container 
                            justify="flex-end" 
                            alignItems="center"
                        >
                            {
                                isAuthenticated ? (
                                    <React.Fragment>
                                        <Grid item>
                                            <Button
                                                style={{color: 'rgba(255, 255, 255, 0.7)'}}
                                                disableTouchRipple
                                                ref={menuAnchor}
                                                onClick={handleToggleMenu}
                                                endIcon={
                                                    <ArrowDropDownIcon/>
                                                }
                                                classes={{
                                                    endIcon: classes.endIcon
                                                }}
                                            >
                                                <Avatar
                                                    className={classes.avatarSmall}
                                                    alt='profile-picture'
                                                    src={avatar} 
                                                />
                                            </Button>
                                            <DropDownMenu
                                                anchor={menuAnchor}
                                                isOpen={isMenuOpen}
                                                setIsOpen={setIsMenuOpen}
                                            >
                                                <CustomMenuList 
                                                    isOpen={isMenuOpen}
                                                    username={username} 
                                                    netcode={netcode}
                                                    avatar={avatar}
                                                    menuItems={createMenuItems()}
                                                />
                                            </DropDownMenu>
                                        </Grid>
                                    </React.Fragment>
                                ) : (
                                    <Button onClick={toLogin}>Login</Button>
                                )
                            }
                            
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
};

export default withRouter(Navbar);