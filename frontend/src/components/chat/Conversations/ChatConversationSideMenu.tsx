import React from 'react';

import { Match } from 'types/match';

import { Theme, makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import ChatConversationList from './ChatConversationList';
import ChatConversationListSearch from './ChatSearchInput';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: 'inherit', 
        backgroundColor: '#F2F1F1'
    },
    header: {
        height: '60px',
        backgroundColor: '#faf9f9', 
        padding: '0px 10px', 
        borderBottom: '2px solid #e6dfdf',
        borderRight: '1px solid #e6dfdf'
    },
    list: {
        height: 'calc(100vh - 60px - 48px)', 
        overflowY: 'auto',
        borderRight: '1px solid #e6dfdf'
    }
}));

interface Props {
    currentMatchId: string;
    userId: string;
    matches: Match[];
    handleChangeConversation: (e: React.MouseEvent, matchId: string) => void;
};

const ConversationsSideMenu: React.FC<Props> = props => {
    const { userId, currentMatchId, matches, handleChangeConversation } = props;

    const [visibleConversations, setVisibleConversations] = React.useState<Match[]>(matches);

    const classes = useStyles();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filteredConversations = matches.filter(conversation => {
            return conversation.players.filter(player => player.userId !== userId)[0].username.toLowerCase().includes(e.target.value.toLowerCase())
        })

        setVisibleConversations(filteredConversations);
    }

    React.useEffect(() => {
        setVisibleConversations(matches)
    }, [matches])

    return (
        <Grid className={classes.root} container direction='column'>
            <Grid item className={classes.header} container justify='center' alignItems='center'>
                <ChatConversationListSearch placeholder='Search conversations...' handleChange={handleSearchChange}/>
            </Grid>
            <Grid item className={classes.list}>
                <ChatConversationList 
                    currentMatchId={currentMatchId}
                    userId={userId}
                    matches={visibleConversations}
                    changeConversationCallback={handleChangeConversation} 
                />
            </Grid>
        </Grid>
    );
};

export default ConversationsSideMenu;