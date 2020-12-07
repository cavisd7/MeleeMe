import ws from 'ws';
import http from 'http';

import { ServerLogger } from '../utils/logging/index';
import { AppLogger } from '../utils/logging/index';
import { Store, PubSub } from '../store';
import { subscribeToChannels } from './events';
import { bundleMessage, parseMessage, verifySession } from '../utils/socketUtils';

/* Socket request and response types */
import { 
    ServerResponseType, 
    ServerResponse,
    Client,
    Socket,
    ISocketMessage,
    SocketHandler
} from './types'; 

/* Services */
import MatchmakingHandler from './handlers/MatchmakingHandler';
import ChatHandler from './handlers/ChatHandler';

export class SocketServer {
    public wss: ws.Server;

    private clients: Map<string, Client>;
    private heartbeatInterval: NodeJS.Timeout | null;

    /* Action handlers */
    private matchmaking;
    private chat;

    constructor() {
        this.clients = new Map<string, Client>();

        this.matchmaking = new MatchmakingHandler();
        this.chat = new ChatHandler();
        
        this.wss = new ws.Server({ noServer: true });
        this.wss.on('connection', (socket, req, session) => this.onConnection(socket, req, session));
        this.wss.on('close', () => this.onClose());
        this.wss.on('error', (_, err) => this.onError(_, err));
        
        this.wss.addListener('channel:subscribe', (channels: string[], socket?) => this.onChannelSubscribe(channels, socket));

        /* TODO: Fix names */
        this.wss.emit('channel:subscribe', ['SERVER', 'MATCHES', 'GROUP']);
        
        this.startHeartbeat();
    };

    private async onChannelSubscribe(channels: string[], socket?: Socket): Promise<void> {
        await subscribeToChannels(channels)
            .catch(err => {
                ServerLogger.error(`Could not subscribe to the following channels: ${channels}`);

                if (!socket) {
                    return;
                    //throw new Error('Could not subscribe to channels');
                };

                socket.emit('error', new Error('Could not subscribe to channels'));
            });
    };

    private onConnection(socket: Socket, req: http.IncomingMessage, session: any) {
        AppLogger.info(`New socket connection ${session.sessionId}`);

        const { sessionId, user: { matchIds } } = session;
        const socketId = `ws.${session.user.userId}`;

        socket.id = socketId;
        this.addClient(socketId, {
            sessionId,
            session,
            socket,
            isAlive: true
        });

        /* Subscribe to user's match rooms */
        if (matchIds.length > 0) {
            this.wss.emit('channel:subscribe', matchIds, socket);
        };

        socket.on('message', (message: string) => this.handleSocketMessage(message, socketId, socket, req));
        socket.on('close', (code: number, data: string) => this.handleSocketClose(code, data, socketId));
        socket.on('error', (err: Error) => this.handleSocketError(err, socketId));
        socket.on('pong', (_: Buffer) => this.clients.get(socketId).isAlive = true);
    };

    private onError(_, err) {
        ServerLogger.error('Socket server encountered an error!');
    };

    private onClose() {
        ServerLogger.info('Socket server closed');

        this.wss.removeAllListeners();
        clearInterval(this.heartbeatInterval);
    };

    private async handleSocketMessage(message: string, socketId: string, socket: Socket, req) {
        try {
            const parsedData = parseMessage(message);
            const { type, channel, payload } = parsedData;

            /* Make sure session is still valid */
            await verifySession(req);

            /* e.g. matchmaking:create-match-request */
            const [domain, action] = type.split(':');
            const handler = this[domain] as SocketHandler;

            if (!handler) {
                socket.emit('error', new Error('Unknown action'));
            };

            /*if (handler.preHandle) {
                await handler.preHandle();
            };*/

            await handler.exec(action, channel, { type, payload });
        } catch (err) {
            socket.emit('error', new Error('Could not handle socket message'));
        };
    };

    private handleSocketClose(code: number, data: string, socketId: string) {
        ServerLogger.warn(`Socket closed ${code} ${data} ${socketId}`);

        this.removeClient(socketId);
    };

    private handleSocketError(err: Error, socketId: string) {
        ServerLogger.error(`Socket ${socketId} encountered an error! ${err}`);

        this.send(socketId, ServerResponse.ERROR, { message: err.message });
    };

    private send(socketId: string, type: ServerResponseType, payload: any): void {
        const client = this.getClient(socketId);
        
        if (!client) {
            ServerLogger.error('No client found!');
            throw new Error('Client not found');
        };
        
        let message;
        
        try {
            message = bundleMessage(type, payload);
        } catch (err) {
            ServerLogger.error(`Error bundling socket message! ${err}`);
            throw new Error('Error bundling socket message');
        };

        client.socket.send(message);
    };

    private startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            this.clients.forEach((client) => {
                if (!client.isAlive) {
                    ServerLogger.warn(`Terminating client ${client.sessionId} for inactivity`);

                    client.socket.terminate();
                    this.removeClient(`ws.${client.session.user.userId}`);
                };
                
                client.isAlive = false;
                client.socket.ping();
            })
        }, 30000);
    };

    private addClient(socketId: string, client: Client): void {
        this.clients.set(socketId, client);
    };

    private removeClient(socketId: string): void {
        this.clients.delete(socketId);
    };

    private getClient(socketId: string): Client {
        return this.clients.get(socketId);
    };
};