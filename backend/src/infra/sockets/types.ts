import ws from 'ws';

namespace SocketMessage {
    /* Matchmaking */

    /* Chat */

    /* Example */
    export const PING = 'PING';
};

type SocketMessageType = 
    | typeof SocketMessage.PING 

export namespace ServerResponse {
    export const ERROR = 'ERROR';
};

export type ServerResponseType = 
    | typeof ServerResponse.ERROR
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