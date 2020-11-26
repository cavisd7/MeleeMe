import React from 'react';
import { Link } from 'react-router-dom';

import { Theme, makeStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme: Theme) => ({
    item: {
        '&:hover': {
            backgroundColor: 'rgba(245, 0, 87, 0.08) !important'
        }
    },
    link: {
        color: '#473d3c !important',
        textDecoration: 'none',
        '&:hover': {
            color: '#2E2423 !important'
        }
    },
}));

interface Props {
    isOpen: boolean;
    toggleDrawer: () => void;
}

const SideMenu: React.FC<Props> = props => {
    const { isOpen, toggleDrawer } = props;

    const classes = useStyles();

    const handleToggleDrawer = (e: React.SyntheticEvent) => {
        toggleDrawer();
    }

    return (
        <Drawer
            anchor='left'
            variant='temporary'
            open={isOpen}
            //onClose={setToggleDrawer}
            ModalProps={{ onBackdropClick: handleToggleDrawer }}
        >
            <div style={{ marginTop: '48px' }}>
                <List>
                    <ListItem className={classes.item}>
                        <Link 
                            className={classes.link}
                            to='/'
                            onClick={toggleDrawer}
                        >
                            <ListItemText primary='Matchmaking' />
                        </Link>
                    </ListItem>
                    <ListItem className={classes.item}>
                        <Link 
                            className={classes.link}
                            to='/parser'
                            onClick={toggleDrawer}
                        >
                            <ListItemText primary='Parser' />
                        </Link>
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
}

export default SideMenu;