import React from 'react';

import { Match } from 'types/match';

import List from '@material-ui/core/List';

import ChatConversationItem from './ChatConversationItem';

interface Props {
    userId: string;
    matches: Match[];
    currentMatchId: string;
    changeConversationCallback: (e: React.MouseEvent, matchId: string) => void;
};

const ChatConversationList: React.FC<Props> = (props) => {
    const { 
        userId, 
        matches, 
        currentMatchId,
        changeConversationCallback 
    } = props;

    return (
        <List style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
            {
                matches.map(match => {
                    return ( 
                        <ChatConversationItem
                            selected={match.matchId === currentMatchId}
                            key={match.matchId}
                            matchId={match.matchId} 
                            correspondent={match.players.filter(player => player.userId !== userId)[0]}
                            handleSelect={(e, matchId) => changeConversationCallback(e, matchId)}
                        />
                    )
                })
            }
        </List>
    );
};

export default ChatConversationList;