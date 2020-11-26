import { actionCreatorFactory } from 'typescript-fsa';

import { Message } from 'types/message';
import { Match } from 'types/match';
import { APIErrorResponse } from 'api/types';

export const CLIENT_CHAT_MESSAGE = 'CLIENT_CHAT_MESSAGE';
export const NEW_CHAT_MESSAGE = 'NEW_CHAT_MESSAGE';

export declare namespace ChatSocketTypes {
    export type CLIENT_CHAT_MESSAGE = typeof CLIENT_CHAT_MESSAGE;
    export type NEW_CHAT_MESSAGE = typeof NEW_CHAT_MESSAGE;
};

const actionCreator = actionCreatorFactory('@chat');

export const getMatchMessages = actionCreator.async<{ matchId: string; range: number }, Message[], APIErrorResponse>('GET_MATCH_MESSAGES');

export const newConversation = actionCreator<{ matchId: string }>('NEW_CONVERSATION');

export const sendMessage = actionCreator<Message>('CLIENT_CHAT_MESSAGE', { isSocketMessage: true });
export const receivedMessage = actionCreator<Message>('RECEIVED_CHAT_MESSAGE');