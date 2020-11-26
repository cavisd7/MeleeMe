import { combineReducers, compose, applyMiddleware, createStore } from "redux";
import thunk from 'redux-thunk';

import account, { accountInitialState, AccountState } from './account/account.reducer';
import matchmaking, { matchmakingInitialState, MatchmakingState } from './matchmaking/matchmaking.reducer';
import chat, { chatInitialState, ChatState } from './chat/chat.reducer';
import match, { matchInitialState, MatchState } from './match/match.reducer';
import notifications, { notificationsInitialState, NotificationsState } from './notifications/notifications.reducer';
import socket, { socketInitialState, SocketState } from "./socket/socket.reducer";
import parser, { parserInitialState, ParserState } from "./parser/parser.reducer";

import { socketMiddleware } from './middleware/socketMiddleware';

const devTools = process.env.NODE_ENV === 'development' ? (window as any).__REDUX_DEVTOOLS_EXTENSION__ : null;

const middleware = [thunk, socketMiddleware()];

export interface ApplicationState {
    account: AccountState,
    matchmaking: MatchmakingState,
    chat: ChatState,
    match: MatchState,
    notifications: NotificationsState,
    socket: SocketState,
    parser: ParserState
};

const appInitialState: ApplicationState = {
    account: accountInitialState,
    matchmaking: matchmakingInitialState,
    chat: chatInitialState,
    match: matchInitialState,
    notifications: notificationsInitialState,
    socket: socketInitialState,
    parser: parserInitialState
};

const reducers = combineReducers({
    account,
    matchmaking,
    chat,
    match,
    notifications,
    socket,
    parser
});

const enhancers = compose(
    applyMiddleware(...middleware),
    devTools ? devTools() : (f: any) => f
);

export default createStore(reducers, appInitialState, enhancers);