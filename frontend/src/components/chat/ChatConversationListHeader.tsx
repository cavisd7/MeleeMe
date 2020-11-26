import React from 'react';

import { Theme, makeStyles, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper'
import CustomFilledInput from 'core/input/CustomFilledInput';
import SearchIcon from '@material-ui/icons/Search';
import ChatConversationListSearch from './Conversations/ChatSearchInput';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        //height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

interface Props {};

const ChatConversationListHeader: React.FC<Props> = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <ChatConversationListSearch placeholder='Search conversations...'/>
        </div>
    );
};

export default ChatConversationListHeader;