import React from 'react';

import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import Popper, { PopperProps } from '@material-ui/core/Popper';

type Classes = 'root';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            zIndex: 2300
        }
    });

interface Props extends PopperProps {};

type CombinedProps = Props & WithStyles<Classes>;

const CustomPopper: React.StatelessComponent<CombinedProps> = (props) => {
    const { classes } = props;

    return (
        <Popper
            className={classes.root}
            {...props}
            transition 
            disablePortal
            placement='bottom-end'
            popperOptions={{
                modifiers: {
                    offset: {
                        offset: '0,11'
                    }
                }
            }}
        >
            {props.children}
        </Popper>
    );
};

const styled = withStyles(styles);

export default styled(CustomPopper);