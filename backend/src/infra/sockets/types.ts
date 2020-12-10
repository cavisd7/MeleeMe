import ws from 'ws';

export namespace SocketMessage {
    /* Matchmaking */
    export const CREATE_MATCH_REQUEST = 'matchmaking:CreateMatchRequest';
    export const INITIATE_MATCH_NEGOTIATIONS = 'matchmaking:InitiateMatchNegotiations';
    export const CONFIRM_MATCH = 'matchmaking:ConfirmMatch';
    export const DENY_MATCH = 'matchmaking:DenyMatch';

    /* Chat */
    export const SEND_CHAT_MESSAGE = 'room:SendChatMessage';

    /* Example */
    export const PING = 'PING';
};

type SocketMessageType = 
    | typeof SocketMessage.CREATE_MATCH_REQUEST
    | typeof SocketMessage.INITIATE_MATCH_NEGOTIATIONS
    | typeof SocketMessage.CONFIRM_MATCH
    | typeof SocketMessage.DENY_MATCH
    ;

export namespace ServerResponse {
    export const NEW_MATCH_REQUEST = 'NewMatchRequest';
    export const REMOVE_MATCH_REQUEST = 'RemoveMatchRequest';
    export const RECEIVED_MATCH_NEGOTIATIONS = 'ReceivedMatchNegotiations';
    export const MATCH_REQUEST_ACK = 'MatchRequestAck';
    export const MATCH_CONFIRMED = 'MatchConfirmed';
    export const MATCH_DENIED = 'MatchDenied';

    export const NEW_CHAT_MESSAGE = 'NewChatMessage';

    export const ERROR = 'ERROR';
};

export type ServerResponseType = 
    | typeof ServerResponse.NEW_MATCH_REQUEST
    | typeof ServerResponse.REMOVE_MATCH_REQUEST
    | typeof ServerResponse.RECEIVED_MATCH_NEGOTIATIONS
    | typeof ServerResponse.MATCH_REQUEST_ACK
    | typeof ServerResponse.MATCH_CONFIRMED
    | typeof ServerResponse.MATCH_DENIED
    | typeof ServerResponse.NEW_CHAT_MESSAGE

    | typeof ServerResponse.ERROR
    ;


export namespace Channel {
    export const SERVER = 'SERVER';
    export const MATCHES = 'MATCHES';
    export const GROUP = 'GROUP';
    
    export const SOCKET = 'SOCKET';
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
    session: Express.Session;
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
    exec: (action: string, channel: string, payload: any, userId?: string) => Promise<void>;
    preHandle?: () => void;
};