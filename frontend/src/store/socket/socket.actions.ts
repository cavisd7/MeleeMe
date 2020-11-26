import { actionCreatorFactory } from 'typescript-fsa';  

export const ERROR = 'ERROR';

export declare namespace SocketTypes {
    export type ERROR = typeof ERROR;
};

const actionCreator = actionCreatorFactory('@Socket');

export const connectSocket = actionCreator<string>('CONNECT_SOCKET', { isSocketMessage: true });
export const disconnectSocket = actionCreator('DISCONNECT_SOCKET');

export const socketConnected = actionCreator('SOCKET_CONNECTED');
export const socketDisconnected = actionCreator('SOCKET_DISCONNECTED');