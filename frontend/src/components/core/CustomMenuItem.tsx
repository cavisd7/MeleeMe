import React from 'react';
import { Link } from 'react-router-dom';

import { 
    Theme, 
    createStyles, 
    WithStyles, 
    withStyles 
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

type Classes = 
    'root' 
    | 'link' 
    | 'icon';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(0.5, 0),
            padding: theme.spacing(0.5, 0.5),
            borderRadius: 2,
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
        icon: {
            minWidth: 0,
            paddingRight: theme.spacing(1)
        }
    });

export interface MenuItem {
    key: string;
    name: string;
    linkTo?: string;
    icon: JSX.Element;
    onClick?: (e: React.ChangeEvent<any>) => void;
};

type CombinedProps = MenuItem & WithStyles<Classes>

class CustomMenuItem extends React.Component<CombinedProps> {
    render () {
        const { 
            classes,
            key, 
            name,
            linkTo,
            icon,
            onClick 
        } = this.props;
    
        return (
            <MenuItem 
                className={classes.root} 
                dense 
                disableGutters 
                onClick={onClick && onClick}
            >
                <ListItemIcon className={classes.icon}>
                    {icon}
                </ListItemIcon>
                {
                    linkTo ? (
                        <Link 
                            className={classes.link} 
                            to={linkTo} 
                        > 
                            {name}
                        </Link>
                    ) : (
                        <span className={classes.link} >
                            {name}
                        </span>
                    )
                }
            </MenuItem>
        );
    }
};

const styled = withStyles(styles);

export default styled(CustomMenuItem);