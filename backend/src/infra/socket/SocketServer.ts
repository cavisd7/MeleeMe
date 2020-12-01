import ws from 'ws';
import http from 'http';

import { ServerLogger } from '../utils/logging/index';
import { AppLogger } from '../utils/logging/index';

//type SessionTransport = Express.Session & { sessionId: string };

interface Client {
    sessionId: string; //express-session id
    session: any; //: Express.Session;
    socket: ws;
    isAlive: boolean;
};

export class SocketServer {
    public wss: ws.Server;
    private clients: Map<string, Client>;

    private heartbeatInterval: NodeJS.Timeout | null;

    constructor() {
        this.clients = new Map<string, Client>();
        
        this.wss = new ws.Server({ noServer: true });
        this.wss.on('connection', (socket, req, session) => this.onConnection(socket, req, session));
        this.wss.on('close', (any) => this.onClose(any));
        this.wss.on('error', (_, err) => this.onError(_, err));

        this.startHeartbeat();
    };

    private onConnection(socket: ws, req: http.IncomingMessage, session: any) {
        AppLogger.info(`New socket connection ${session.sessionId}`);

        const { sessionId } = session;
        const socketId = `ws.${session.user.userId}`;

        this.addClient(socketId, {
            sessionId,
            session,
            socket,
            isAlive: true
        });
        
        /* Subscribe to user's match rooms */

        socket.on('message', (message: string) => this.handleSocketMessage(message, socketId, socket));
        socket.on('close', (code: number, data: string) => this.handleSocketClose(code, data, socketId));
        socket.on('error', (err: Error) => this.handleSocketError(err, socketId));
        socket.on('pong', (_: Buffer) => this.clients.get(socketId).isAlive = true);
    };

    private onError(_, err) {

    };

    private onClose(any) {
        ServerLogger.info('Socket server closed');
        
        clearInterval(this.heartbeatInterval);
    };

    private handleSocketMessage(message: string, socketId: string, socket: ws) {
    };

    private handleSocketClose(code: number, data: string, socketId: string) {
        ServerLogger.warn(`Socket closed ${code} ${data} ${socketId}`);

        this.removeClient(socketId);
    };

    private handleSocketError(err: Error, socketId: string) {

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

    private addClient(socketId: string, client: Client) {
        this.clients.set(socketId, client);
    };

    private removeClient(socketId: string) {
        this.clients.delete(socketId);
    };
};