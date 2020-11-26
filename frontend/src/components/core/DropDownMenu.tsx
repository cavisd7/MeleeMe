import React from 'react';
import { Theme, makeStyles, MenuItem } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';

import CustomPopper from './CustomPopper';
import CustomMenuItem, { MenuItem as _MenuItem } from './CustomMenuItem';

/*const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        minWidth: '128px',
        boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.2), 1px 5px 8px 0px rgba(0,0,0,0.14), 1px 1px 14px 0px rgba(0,0,0,0.12)',
    }
}));*/

interface Props {
    anchor: React.RefObject<any>;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    //menuItems: _MenuItem[];
};

class DropDownMenu extends React.Component<Props, {}> {
    constructor(props) {
        super(props);

        this.handleCloseMenu = this.handleCloseMenu.bind(this);
    }

    handleCloseMenu = (e) => {
        const { anchor, setIsOpen } = this.props;

        console.log('handleclose', anchor)

        if (anchor.current && anchor.current.contains(e.target)) {
            return;
        };

        setIsOpen(false);
    };

    
    render () {
        const { 
            anchor, 
            isOpen,
            setIsOpen, 
        } = this.props;
        
        //const classes = useStyles();

        return (
            <React.Fragment>
                <CustomPopper
                    open={isOpen}
                    anchorEl={anchor.current}
                >
                    {
                        ({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                                }}
                            >
                                <Paper 
                                    //className={classes.paper}
                                    elevation={5} 
                                >
                                    <ClickAwayListener onClickAway={this.handleCloseMenu}>
                                        {this.props.children}
                                    </ClickAwayListener>
                                </Paper>
                            </Grow> 
                        )
                    }
                </CustomPopper>
            </React.Fragment>
        );
    }
};

export default DropDownMenu;