import React from 'react';

import { Message } from 'types/message';
import { APIErrorResponse } from 'api/types'

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import ChatConversationHeader from './ChatConversationHeader';
import ChatMessageList from '../ChatMessageList';
import ChatInput from '../ChatInput';
import { Match } from 'types/match';
import ConfirmMatchBanner from '../ConfirmMatchBanner';
import ChatConversationWrapper from './ChatConversationWrapper';

interface Props {
    userId: string;
    match: Match;
    messages: Message[];
    sendMessage: (messageText: string) => void;
    getMatchMessages: (params: { matchId: string; range: number }) => Promise<Message[]>;
    loading: boolean;
    error: APIErrorResponse;
    //matchLoading: boolean;
    //matchError: APIErrorResponse;
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
        //matchLoading,
        //matchError,
        confirmMatch,
        handleDenyMatch
    } = props;

    const mounted = React.useRef<any>();
    const messagesLoaded = React.useRef<any>();

    const [loaded, setLoaded] = React.useState(false);
    const [localConfirm, setLocalConfirm] = React.useState<boolean>(props.match.isConfirmed);
    //const [localConfirm, setLocalConfirm] = React.useState(false);

    //didupdate
    React.useEffect(() => {
        if (!mounted.current) {
            //mount
            mounted.current = true;
            console.log('[convo] comp did mount', props);

            if (match && !messages) {
                const { matchId } = match;
                console.log('calling to get messages on mount')
        
                getMatchMessages({ matchId, range: 10 })
            }

        } else {
            //update
            //console.log('[convo] comp updated', props);
            //console.log('[convo] comp updated', props.match.isConfirmed);
            if (props.match.isConfirmed) {
                setLocalConfirm(true)
            }

            if (match && !messages) {
                const { matchId } = match;
                console.log('calling to get messages on mount')
        
                getMatchMessages({ matchId, range: 10 })
            }

            if (messages && !loading && !error) {  
                //setInitialMessages(messages);
                setLoaded(true);
            } 

            if (!messagesLoaded.current && !loading && match) {
                const { matchId } = match;
                console.log('calling to get messages on update')
        
                getMatchMessages({ matchId, range: 10 })
            } else {
                messagesLoaded.current = true;
            }
        }

        return () => {
            console.log('unmounting')
            //messagesLoaded.current = null;
        }
    });

    const handleConfirmMatch = () => {
        confirmMatch({ matchId: match.matchId });
        //setLocalConfirm(true)
    }

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

/**
 * <React.Fragment>
                            <Grid item style={{ }}>
                            <ChatConversationHeader 
                            correspondentUsername={match.players.filter(player => player.userId !== userId)[0].username} 
                            correspondentNetcode={match.players.filter(player => player.userId !== userId)[0].netcode}
                        />
                    </Grid>
                    {
                        (!localConfirm && match.players.filter(player => player.isOwner)[0].userId === userId) && (
                            <ConfirmMatchBanner 
                                confirmMatch={handleConfirmMatch}
                                denyMatch={handleDenyMatch}
                            />
                        )
                    }
                    <Grid item style={{flex: '1 1 0', height: '0px', overflowY: 'auto', width:'100%', maxWidth: '100%'}}>
                        <ChatMessageList messages={messages}/>
                    </Grid>
                    <Grid item style={{padding: '2rem 1rem'}}>
                        <ChatInput sendMessage={sendMessage}/>
                    </Grid>
                </React.Fragment>
 */