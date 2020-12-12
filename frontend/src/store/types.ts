import { ActionCreator, Action, AnyAction } from "redux"
import { ThunkAction } from "redux-thunk"
import { AsyncActionCreators } from 'typescript-fsa';

import { ApplicationState } from './index';

import { ChatSocketTypes } from "./chat/chat.actions";
import { MatchmakingSocketTypes } from "./matchmaking/matchmaking.actions";
import { SocketTypes } from "./socket/socket.actions";

export type SocketMessageTypes = 
    | ChatSocketTypes.SEND_CHAT_MESSAGE
    | ChatSocketTypes.NEW_CHAT_MESSAGE
    | MatchmakingSocketTypes.CREATE_MATCH_REQUEST
    | MatchmakingSocketTypes.INITIATE_MATCH_NEGOTIATIONS
    | MatchmakingSocketTypes.NEW_MATCH_REQUEST
    | MatchmakingSocketTypes.RECEIVED_MATCH_NEGOTIATIONS
    | MatchmakingSocketTypes.MATCH_REQUEST_ACK
    | MatchmakingSocketTypes.REMOVE_MATCH_REQUEST
    | MatchmakingSocketTypes.DENY_MATCH
    | MatchmakingSocketTypes.CONFIRM_MATCH
    | MatchmakingSocketTypes.MATCH_CONFIRMED
    | MatchmakingSocketTypes.MATCH_DENIED
    | SocketTypes.ERROR
    ;

export interface SocketAction<T extends SocketMessageTypes, U> {
    type: T;
    payload: U;
};

export interface _SocketAction<T, U> extends AnyAction {
    socketType: T;
    payload: U; 
}

export type ThunkActionCreator<Transport, Payload> = (args: Transport) => ThunkAction<Payload, ApplicationState, undefined, Action>;
//type ActionType<R, S, A extends Action> = ActionCreator<ThunkAction<R, S, undefined, A>>;

export type ThunkActionCreatorTest<ReturnType, Params = void> = (
    args: Params, 
    ...args2: any[]
) => ThunkAction<ReturnType, ApplicationState, undefined, Action>;
