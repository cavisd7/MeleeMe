import React from 'react';

import { Message } from 'types/message';
import { APIErrorResponse } from 'api/types'

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { Match } from 'types/match';
import ChatConversationWrapper from './ChatConversationWrapper';

interface Props {
    userId: string;
    match: Match;
    messages: Message[];
    sendMessage: (messageText: string) => void;
    getMatchMessages: (params: { matchId: string; range: number }) => Promise<Message[]>;
    loading: boolean;
    error: APIErrorResponse;
    confirmMatch: (params: { matchId: string; }) => void;
    handleDenyMatch: () => void;
};

const ChatSelectedConversation: React.FC<Props> = (props) => {
    const { 
        messages, 
        sendMessage, 
        match, 
        userId,
        getMatchMessages,
        loading, 
        error,
        confirmMatch,
        handleDenyMatch
    } = props;

    const mounted = React.useRef<any>();
    const messagesLoaded = React.useRef<any>();

    const [loaded, setLoaded] = React.useState(false);
    const [localConfirm, setLocalConfirm] = React.useState<boolean>(props.match.isConfirmed);

    React.useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;

            if (match && !messages) {
                const { matchId } = match;
        
                getMatchMessages({ matchId, range: 10 })
            }

        } else {
            if (props.match.isConfirmed) {
                setLocalConfirm(true)
            }

            if (match && !messages) {
                const { matchId } = match;
        
                getMatchMessages({ matchId, range: 10 })
            }

            if (messages && !loading && !error) {  
                setLoaded(true);
            } 

            if (!messagesLoaded.current && !loading && match) {
                const { matchId } = match;
        
                getMatchMessages({ matchId, range: 10 })
            } else {
                messagesLoaded.current = true;
            }
        }

        return () => {
            //messagesLoaded.current = null;
        }
    });

    const handleConfirmMatch = () => {
        confirmMatch({ matchId: match.matchId });
    };

    return (
        <Paper style={{height: '100%', boxShadow: 'none', maxWidth: '100%'}}>
            <Grid container spacing={0} direction="column" wrap="wrap" style={{height: '100%', maxWidth: '100%'}}>
                {
                    loaded && messages ? error ? (<p>{error.reason}</p>) : (
                        <ChatConversationWrapper 
                            messages={messages}
                            userId={userId}
                            match={match}
                            sendMessage={sendMessage}
                            confirmMatch={handleConfirmMatch}
                            handleDenyMatch={handleDenyMatch}
                            matchConfirmed={localConfirm}
                        />
                    ) : (
                        <p>loading..</p>
                    )
                }
            </Grid>
        </Paper>
    );
};

export default ChatSelectedConversation;