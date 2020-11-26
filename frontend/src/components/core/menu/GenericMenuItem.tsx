import React from 'react';

import { Theme, withStyles, createStyles, WithStyles } from '@material-ui/core';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';

type Classes = 'root'; 

const styles = (theme: Theme) =>
    createStyles({
        root: {
            marginTop: '4px', marginBottom: '4px',
            padding: '4px',
            borderRadius: 2,
            '&:hover': {
                color: 'rgba(255, 255, 255, 0.7) !important'
            }
        }
    });

interface Props extends MenuItemProps<any, any> {};

type CombinedProps = Props & WithStyles<Classes>;

const GenericMenuItem: React.StatelessComponent<CombinedProps> = (props) => {
    const { classes } = props;

    return (
        <MenuItem
            className={classes.root}
            {...props}
        >
            {props.children}
        </MenuItem>
    );
};

const styled = withStyles(styles)

export default styled(GenericMenuItem);
