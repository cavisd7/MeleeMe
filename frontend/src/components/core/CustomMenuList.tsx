import React from 'react';

import { Theme, createStyles, WithStyles, withStyles, Typography, Grid } from '@material-ui/core';
import MenuList from '@material-ui/core/MenuList';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';

import CustomMenuItem, { MenuItem as _MenuItem } from './CustomMenuItem';

type Classes = 'root' | 'disabledFix';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            minWidth: '150px',
            margin: theme.spacing(0, 1),
            padding: theme.spacing(0.5, 0)
        },
        disabledFix: {
            opacity: '1.0 !important'
        }
    });

interface Props {
    isOpen: boolean;
    username: string;
    netcode: string;
    avatar: string;
    menuItems: _MenuItem[];
};

type CombinedProps = Props & WithStyles<Classes>;

class CustomMenuList extends React.PureComponent<CombinedProps> {
    render() {
        const { 
            classes, 
            isOpen, 
            username,
            netcode,
            menuItems,
            avatar 
        } = this.props;

        return (
            <MenuList 
                className={classes.root} 
                autoFocusItem={isOpen}
            >

                <MenuItem className={classes.disabledFix} disabled disableGutters>
                    <Grid container direction='column' alignItems='center'>
                        <Avatar src={avatar} style={{ width: '35px', height: '35px', marginBottom: '0.3rem' }}/>
                        <Typography variant='subtitle2' color='textPrimary'><strong>{username}</strong></Typography>
                        <Typography variant='caption'>{netcode}</Typography>
                    </Grid>
                </MenuItem>
                <Divider /> 
                {
                    menuItems.map(item => {
                        return (
                            <div>
                                <CustomMenuItem
                                    key={item.key}
                                    name={item.name}
                                    linkTo={item.linkTo}
                                    icon={item.icon}
                                    onClick={item.onClick}
                                /> 
                                {
                                    item.key === 'account' && <Divider /> 
                                }
                            </div>
                        )
                    })
                }
            </MenuList>
        );
    };
};

const styled = withStyles(styles);

export default styled(CustomMenuList);