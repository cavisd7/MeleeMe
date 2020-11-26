import React from 'react';

import { makeStyles, Theme, ListItemAvatar, Avatar, Grid } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { formatTime } from '../../utils/time';

const useStyles = makeStyles((theme: Theme) => ({
    time: {
        minWidth: '3.5rem', 
        //margin: theme.spacing(0, 0),
        marginLeft: '0.5rem', 
        marginRight: '0.5rem'
    },
    timeHidden: {
        visibility: 'hidden',
    },
    listItem: {
        '&:hover': {
            backgroundColor: '#e6dfdf'
        }
    },
    secondary: {
        overflowWrap: 'break-word'    
    }
}));

interface Props {
    //key: string;
    avatar: string;
    messageId: string;
    sender: string;
    text: string;
    date: Date;
    displayTime?: boolean;
};

const ChatMessageItem: React.FC<Props> = (props) => {
    const { 
        avatar,
        sender,
        text,
        date,
        displayTime
    } = props;

    const classes = useStyles();

    return (
        <ListItem 
            style={{ marginTop: '1rem', padding: '0 1.5rem' }}
            button 
            disableGutters
            alignItems='flex-start'
            classes={{
                root: classes.listItem
            }}
        >
            <ListItemAvatar>
                <Avatar alt={sender} src={avatar}/>
            </ListItemAvatar>
            <ListItemText                              
                primary={
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Typography variant='subtitle2' style={{ color: '#f44336', marginRight: '0.5rem' }}>
                            {sender}
                        </Typography>
                        <Typography style={{ color: 'rgba(0,0,0,0.45)' }} variant='caption'>{formatTime(date)}</Typography>
                    </div>
                }
                secondary={
                    text
                }
                classes={{ 
                    secondary: classes.secondary
                }}
            >
            </ListItemText>
        </ListItem>
    );
};

export default ChatMessageItem;