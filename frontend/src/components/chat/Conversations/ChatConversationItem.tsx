import React from 'react';

import { User } from 'types/user';

import { Theme, makeStyles, Typography, ListItemText, ListItemAvatar, Avatar, Hidden } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';

const useStyles = makeStyles((theme: Theme) => ({
    item: {
        borderRadius: '5px',
        '&:hover': {
            backgroundColor: '#e6dfdf',
            //color: 'green',
        },
    },
    primaryText: {
        /*transition: 'color 225ms ease-in-out',
        color: '#473d3c',
        '&:hover': {
            color: '#000 !important'
        }*/
    }
}));

interface Props {
    matchId: string;
    correspondent: Partial<User>;
    selected: boolean;
    handleSelect: (e: React.MouseEvent, matchId: string) => void;
};

const ChatConversationItem: React.FC<Props> = (props) => {
    const { 
        matchId, 
        correspondent,
        selected,
        handleSelect 
    } = props;

    const classes = useStyles();

    /*const handleSelect = (e: React.MouseEvent) => {

    } */  

    return (
        <ListItem
            disableRipple 
            disableTouchRipple 
            selected={selected}
            className={classes.item}
            button
            onClick={(e) => handleSelect(e, matchId)}
        >
            <Hidden mdDown>
                <ListItemAvatar style={{ minWidth: '45px' }}>
                    <Avatar style={{ width: '35px', height: '35px' }} alt={correspondent.username} src={correspondent.avatar} />
                </ListItemAvatar>
            </Hidden>
            <ListItemText
                primary={
                    <React.Fragment>
                        <Typography variant='subtitle2' style={{ color: '#473d3c', lineHeight: '0.9rem' }}>
                            <strong>{correspondent.username}</strong>
                        </Typography>
                    </React.Fragment>
                }
                /*secondary={
                    <Hidden mdDown>
                        <Typography variant='caption' noWrap style={{ color: 'rgba(0, 0, 0, 0.45)', width: '8rem', display: 'block' }}>
                            Filler message
                        </Typography>
                    </Hidden>
                }*/
                classes={{
                    //primary: classes.primaryText,
                }}
            />
        </ListItem>
    );
};

export default ChatConversationItem;

/**
 * <Typography variant='subtitle2' style={{ color: '#473d3c' }}>
 */