import React from 'react';

import { Theme, makeStyles, Typography, Divider, Grid, IconButton, Hidden } from '@material-ui/core';
import Paper from '@material-ui/core/Paper'
import ChatSearchInput from '../Conversations/ChatSearchInput';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        borderBottom: '2px solid #e6dfdf',
        borderRight: '1px solid #e6dfdf',
        height: '60px',
        backgroundColor: '#faf9f9',
        padding: '0.5rem 1.5rem',
        //boxShadow: 'inset 0 -1px 0 #c5c6c8',
    },
    name: {
        borderRight: '1px solid #e6dfdf', 
        paddingRight: '1rem',
        [theme.breakpoints.down('sm')]: {
            //borderRight: 'none',

        }
    }
}));

interface Props {
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    correspondentUsername: string;
    correspondentNetcode: string;
};

const ChatConversationHeader: React.FC<Props> = (props) => {
    const { correspondentUsername, correspondentNetcode, handleSearchChange } = props;

    const classes = useStyles();

    return (
        <Grid container className={classes.root} justify='space-between' alignItems='center'>
            <Grid item xs={8} container spacing={0} alignItems='center'>
                <Hidden smDown>
                    <Grid item>
                        <AlternateEmailIcon />
                    </Grid>
                </Hidden>
                <Grid item className={classes.name}>
                    <Typography variant='body1' style={{ color: '#473d3c' }}>
                        <strong>
                            {correspondentUsername}
                        </strong>
                    </Typography>
                </Grid>
                <Grid item style={{ paddingLeft: '1rem' }}>
                    <Typography variant='caption' style={{ color: 'rgba(0,0,0,0.50)' }}>
                        {correspondentNetcode}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={4} container alignItems='center'>
                <Grid item xs={11}>
                    <ChatSearchInput placeholder='Search chat history...' handleChange={handleSearchChange}/>
                </Grid>
                <Grid item xs={1}>
                    <IconButton
                        disableFocusRipple
                        disableRipple
                        disableTouchRipple
                    >
                        <DeleteOutlineIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ChatConversationHeader;