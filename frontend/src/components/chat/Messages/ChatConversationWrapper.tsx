import React from 'react';

import { Match } from 'types/match';
import { Message } from 'types/message';

import ChatConversationHeader from './ChatConversationHeader';
import ConfirmMatchBanner from '../ConfirmMatchBanner';
import ChatMessageList from '../ChatMessageList';
import ChatInput from '../ChatInput';

import Grid from '@material-ui/core/Grid';

interface Props {
    messages: Message[];
    userId: string;
    match: Match;
    sendMessage: (messageText: string) => void;
    confirmMatch: () => void;
    handleDenyMatch: () => void;
    matchConfirmed: boolean;
}

const ChatConversationWrapper: React.FC<Props> = (props) => {
    const { 
        messages, 
        sendMessage, 
        match, 
        userId,
        confirmMatch,
        handleDenyMatch,
        matchConfirmed
    } = props;

    const [visibleMessages, setVisibleMessages] = React.useState<Message[]>(messages);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filteredMessages = messages.filter(message => {
            return message.text.toLowerCase().includes(e.target.value.toLowerCase())
        })

        setVisibleMessages(filteredMessages);
    }

    React.useEffect(() => {
        setVisibleMessages(messages)
    }, [messages])

    return (
        <React.Fragment>
            <Grid item>
                <ChatConversationHeader 
                    handleSearchChange={handleSearchChange}
                    correspondentUsername={match.players.filter(player => player.userId !== userId)[0].username} 
                    correspondentNetcode={match.players.filter(player => player.userId !== userId)[0].netcode}
                />
            </Grid>
            {
                (!matchConfirmed && match.players.filter(player => player.isOwner)[0].userId === userId) && (
                    <ConfirmMatchBanner 
                        confirmMatch={confirmMatch}
                        denyMatch={handleDenyMatch}
                    />
                )
            }
            <Grid item style={{flex: '1 1 0', height: '0px', overflowY: 'auto', width:'100%', maxWidth: '100%'}}>
                <ChatMessageList messages={visibleMessages}/>
            </Grid>
            <Grid item style={{ padding: '2rem 1rem'}}>
                <ChatInput sendMessage={sendMessage}/>
            </Grid>
        </React.Fragment>
    )
}

export default ChatConversationWrapper;