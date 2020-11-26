import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { connectSocket, disconnectSocket, socketConnected, socketDisconnected } from './socket.actions';

export interface SocketState {
    host: string | null;
    connected: boolean;
};

export const socketInitialState: SocketState = {
    host: null,
    connected: false
};

const socketReducer: Reducer<SocketState> = (state: SocketState = socketInitialState, action) => {
    if (isType(action, connectSocket)) {
        return {
            ...state,
            host: action.payload,
            connected: true
        };
    };

    if (isType(action, disconnectSocket)) {
        return {
            host: null,
            connected: false
        };
    };

    if (isType(action, socketConnected)) {
        return {
            ...state,
            connected: true,
        };
    };

    if (isType(action, socketDisconnected)) {
        return {
            host: null,
            connected: false,
        };
    };

    return state;
};

export default socketReducer;