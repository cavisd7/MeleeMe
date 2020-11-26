import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';

import { Message } from 'types/message';
import { APIErrorResponse } from 'api/types';

import { newConversation, receivedMessage, getMatchMessages } from './chat.actions';

interface Messages {
    [key: string]: Message[];
};

export interface ChatState {
    messages: Messages;
    loading: boolean;
    error: APIErrorResponse | null;
};

export const chatInitialState: ChatState = {
    messages: {
        //'1234': []
    },
    loading: false,
    error: null
};

const chat: Reducer<ChatState> = (state: ChatState = chatInitialState, action) => {
    if (isType(action, newConversation)) {
        action.payload
        return {
            ...state,
            messages: {
                ...state.messages,
                [action.payload.matchId]: []
            } 
        }
    }

    if (isType(action, receivedMessage)) {
        action.payload
        return {
            ...state,
            messages: {
                ...state.messages,
                [action.payload.matchId]: [...state.messages[action.payload.matchId], action.payload]
            } 
        }
    }

    if (isType(action, getMatchMessages.started)) {
        return {
            ...state,
            loading: true
        }
    }
    if (isType(action, getMatchMessages.done)) {
        const { result, params: { matchId } } = action.payload
 
        return {
            ...state,
            loading: false,
            messages: {
                ...state.messages,
                [matchId]: result
            }
        }
    }
    if (isType(action, getMatchMessages.failed)) {
        const { error } = action.payload

        return {
            ...state,
            loading: false,
            error
        }
    }

    return state;
};

export default chat;