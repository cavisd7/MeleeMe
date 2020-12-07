import ws from 'ws';

export namespace SocketMessage {
    /* Matchmaking */
    export const CREATE_MATCH_REQUEST = 'CREATE_MATCH_REQUEST';
    export const DENY_MATCH = 'DENY_MATCH';
    export const CONFIRM_MATCH = 'CONFIRM_MATCH';

    /* Chat */

    /* Example */
    export const PING = 'PING';
};

type SocketMessageType = 
    | typeof SocketMessage.CREATE_MATCH_REQUEST
    | typeof SocketMessage.CONFIRM_MATCH
    | typeof SocketMessage.DENY_MATCH
    ;

export namespace ServerResponse {
    export const ERROR = 'ERROR';
};

export type ServerResponseType = 
    | typeof ServerResponse.ERROR
    ;


export namespace Channel {
    export const SERVER = 'SERVER';
    export const MATCHES = 'MATCHES';
    export const GROUP = 'GROUP';
};

export type ChannelType = 
    |  typeof Channel.SERVER
    | typeof Channel.MATCHES
    | typeof Channel.GROUP
    | {[key: string]: string}
    ; 
//type SessionTransport = Express.Session & { sessionId: string };

export interface Client {
    sessionId: string; //express-session id
    session: any; //: Express.Session;
    socket: Socket;
    isAlive: boolean;
};

export interface ISocketMessage {
    type: SocketMessageType;
    channel: string;
    payload: any;
};

export type Socket = ws & { id: string };

export interface Payload<T> {
    type: string;
    payload: T;
};

export interface SocketHandler {
    exec: (action: string, channel: string, payload: any) => Promise<void>;
    preHandle?: () => void;
};