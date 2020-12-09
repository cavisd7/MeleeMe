import { Dispatch, AnyAction, MiddlewareAPI/*, Action*/, Middleware } from 'redux';
import { ApplicationState } from '../index';
import { Action as FsaAction } from 'typescript-fsa';

import { SocketAction, _SocketAction, SocketMessageTypes } from '../types';

import { 
    createMatchRequest, 
    NEW_MATCH_REQUEST, 
    newMatchRequest, 
    CREATE_MATCH_REQUEST,
    INITIATE_MATCH_NEGOTIATIONS,
    RECEIVED_MATCH_NEGOTIATIONS,
    MATCH_REQUEST_ACK,
    REMOVE_MATCH_REQUEST,
    receivedMatchNegotiations,
    removeMatchById,
    CONFIRM_MATCH,
    DENY_MATCH, 
    MATCH_CONFIRMED,
    MATCH_DENIED,
    resetNegotiating,
} from '../matchmaking/matchmaking.actions';
import { connectSocket, disconnectSocket, ERROR } from '../socket/socket.actions';
import { 
    sendMessage, 
    SEND_CHAT_MESSAGE, 
    newConversation, 
    NEW_CHAT_MESSAGE, 
    receivedMessage 
} from '../chat/chat.actions';

import { MatchRequest, NegotiateMatchRequest } from 'types/match'

import { addMatch, removeMatch, updateMatchConfirmed } from '../match/match.actions';

interface IncomingSocketMessage {
    type: SocketMessageTypes;
    payload: any;
};

export const socketMiddleware = (): Middleware<any, ApplicationState, any> => {
    let socket: WebSocket = null;

    const onOpen = store => () => {
        console.log('Socket connected');
    };

    const onClose = store => (event) => {
        console.log('Socket disconnected', event);
    };

    const onError = store => (err) => {
        console.log('socket error', err)
    }

    /*Incoming socket messages */
    const onMessage = store => (event: MessageEvent) => {
        const { dispatch } = store;
        const { data } = event;
        
        let parsedData: IncomingSocketMessage;
        
        try {
            parsedData = JSON.parse(data);
            console.log('incoming socket message')
        } catch (e) {
            //TODO: send to socket reducer
            console.log('[SOCKET ERROR] Failed to parse incoming data!', e);
        };
        
        const { payload } = parsedData;
        
        switch (parsedData.type) {
            case NEW_CHAT_MESSAGE:
                dispatch(receivedMessage(payload));
                break;
            case NEW_MATCH_REQUEST:
                dispatch(newMatchRequest(payload as MatchRequest));
                break;
            case RECEIVED_MATCH_NEGOTIATIONS:
                dispatch(receivedMatchNegotiations(payload as NegotiateMatchRequest)); //TODO: split on backend?
                dispatch(addMatch({
                    matchId: payload.matchId,
                    players: [
                        {
                            userId: payload.ownerUserId,
                            username: payload.ownerUsername,
                            netcode: payload.ownerNetcode,
                            isOwner: true //TODO: fix
                        },
                        {
                            userId: payload.challengerUserId,
                            username: payload.challengerUsername,
                            netcode: payload.challengerNetcode,
                            isOwner: false //TODO: fix
                        }
                    ],
                    isConfirmed: false
                }));
                dispatch(newConversation({matchId: payload.matchId }));
                break;
            case MATCH_REQUEST_ACK:
                dispatch(receivedMatchNegotiations(payload as NegotiateMatchRequest));
                dispatch(addMatch({
                    matchId: payload.matchId,
                    players: [
                        {
                            userId: payload.ownerUserId,
                            username: payload.ownerUsername,
                            netcode: payload.ownerNetcode,
                            isOwner: true //TODO: fix
                        },
                        {
                            userId: payload.challengerUserId,
                            username: payload.challengerUsername,
                            netcode: payload.challengerNetcode,
                            isOwner: false //TODO: fix
                        }
                    ],
                    isConfirmed: false
                }));
                dispatch(newConversation({ matchId: payload.matchId }));
                break;
            case REMOVE_MATCH_REQUEST:
                dispatch(removeMatchById(payload));
                break;

            case MATCH_CONFIRMED:
                //for challenger and owner
                //set negotiation to null
                dispatch(updateMatchConfirmed(payload));
                dispatch(resetNegotiating());
                break;
            case MATCH_DENIED: 
                //for challenger and owner
                //set negotiation to null
                //remove match from matches
                console.log('MATCH_DENIED message')
                dispatch(removeMatch(payload));
                dispatch(resetNegotiating());
                break;
            case ERROR:
                console.log('socket error from server', payload)
                break;
            default:
                break;
        } 
    };

    const handleSendMessage = (socket, actionType: SocketMessageTypes, actionPayload) => {
        let messageType: SocketMessageTypes;
        let channel: string;

        switch (actionType) {
            case SEND_CHAT_MESSAGE:
                messageType = SEND_CHAT_MESSAGE;
                //channel = actionPayload.matchId;
                channel = 'GROUP';
                break;
            case CREATE_MATCH_REQUEST:
                messageType = CREATE_MATCH_REQUEST;
                channel = 'MATCHES';
                break;
            case INITIATE_MATCH_NEGOTIATIONS:
                messageType = INITIATE_MATCH_NEGOTIATIONS;
                channel = 'SERVER';
                break;
            case CONFIRM_MATCH:
                messageType = CONFIRM_MATCH;
                //channel = actionPayload.matchId;
                channel = 'GROUP';
                break;
            case DENY_MATCH:
                messageType = DENY_MATCH;
                //channel = actionPayload.matchId;
                channel = 'GROUP';
                break;
            default: break;
        }

        //TODO: just use actionType 
        const transport: { type: SocketMessageTypes; channel: string; payload: any; } = { type: messageType, channel, payload: actionPayload };
        const data = JSON.stringify(transport);
        socket.send(data);
    }

    return store => next => (action: FsaAction<any>/*_SocketAction<any, any>*/) => {
        const { type, payload } = action;

        if (action.meta?.isSocketMessage) {
            switch (type) {
                case connectSocket.type:
                    if (socket !== null) socket.close();
    
                    socket = new WebSocket(payload);
    
                    socket.onmessage = onMessage(store);
                    socket.onclose = (event) => {
                        console.log('close event', event);
                        //new WebSocket(payload);
                    };
                    socket.onopen = onOpen(store);
                    socket.onerror = onError(store);
    
                    break;
                case disconnectSocket.type:
                    if (socket !== null) socket.close();
                    
                    socket = null;
    
                    break;
                default:
                    const socketType = type.split('/').pop() as SocketMessageTypes;

                    if (socket !== null) {
                        handleSendMessage(socket, socketType, payload)
                    };
                    break;
            };
        } else {
            return next(action);
        }
    }
}

//store: MiddlewareAPI<Dispatch<AnyAction>, ApplicationState>