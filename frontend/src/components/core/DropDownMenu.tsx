import React from 'react';

import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import CustomPopper from './CustomPopper';
import { MenuItem as _MenuItem } from './CustomMenuItem';

interface Props {
    anchor: React.RefObject<any>;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

class DropDownMenu extends React.Component<Props, {}> {
    constructor(props) {
        super(props);

        this.handleCloseMenu = this.handleCloseMenu.bind(this);
    }

    handleCloseMenu = (e) => {
        const { anchor, setIsOpen } = this.props;

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