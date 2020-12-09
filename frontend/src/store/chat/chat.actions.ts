import { actionCreatorFactory } from 'typescript-fsa';

import { Message } from 'types/message';
import { APIErrorResponse } from 'api/types';

/* From client to server */
export const SEND_CHAT_MESSAGE = 'room:SendChatMessage';

/* From server to client */
export const NEW_CHAT_MESSAGE = 'NewChatMessage';

export declare namespace ChatSocketTypes {
    export type SEND_CHAT_MESSAGE = typeof SEND_CHAT_MESSAGE;
    export type NEW_CHAT_MESSAGE = typeof NEW_CHAT_MESSAGE;
};

const actionCreator = actionCreatorFactory('@chat');

export const getMatchMessages = actionCreator.async<{ matchId: string; range: number }, Message[], APIErrorResponse>('GET_MATCH_MESSAGES');

export const newConversation = actionCreator<{ matchId: string }>('NEW_CONVERSATION');

export const sendMessage = actionCreator<Message>(SEND_CHAT_MESSAGE, { isSocketMessage: true });
export const receivedMessage = actionCreator<Message>('RECEIVED_CHAT_MESSAGE');