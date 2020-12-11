import http from 'http';

import config from './infra/config';
import { ServerLogger, AppLogger } from './infra/utils/logging';
import { SocketServer } from './infra/sockets/SocketServer';

export interface IServer {
    start: () => void;
    stop: () => void;
};

export class Server implements IServer {
    static readonly PORT = config.serverPort;

    private httpServer: http.Server;
    private SocketServer: SocketServer;
    private logConnectionsInterval;

    constructor(app: Express.Application, authenticateSession) {
        this.httpServer = http.createServer(app);
        this.httpServer.on('error', (err) => this.onError(err));
        this.httpServer.on('listening', () => this.onListening());
        this.httpServer.on('close', () => this.onClose())
        this.httpServer.on('upgrade', (req, socket, head) => this.onUpgrade(req, socket, head, authenticateSession));
        
        this.SocketServer = new SocketServer();
    };

    public start() {
        this.httpServer.listen(Server.PORT);
    };

    public async stop() {
        return new Promise((resolve, reject) => {
            if (this.httpServer === null) {
                return resolve('No server to shutdown');
            };

            this.httpServer.close((err) => {
                if (err) {
                    return reject(err);
                };

                return resolve('Successful shutdown');
            });
        });
    };

    private onError(err) {
        if (err.errno) {
            ServerLogger.error(`Port ${Server.PORT} already in use!`);
        } else {
            ServerLogger.error(`Server encountered and error! ${err}`);
        };
    };

    private onListening() {
        ServerLogger.info(`Server is listening for requests on ${Server.PORT}`);

        this.logConnectionsInterval = setInterval(() => this.httpServer.getConnections((err, connectionCount) => {
            ServerLogger.info(`${connectionCount} connections currently open on server`); /* TODO: change level */
        }), 5000);

        process.removeAllListeners('SIGINT').on('SIGINT', this.shutdown.bind(this));
        process.removeAllListeners('SIGTERM').on('SIGTERM', this.shutdown.bind(this));
    };

    private onClose() {
        clearInterval(this.logConnectionsInterval);
        ServerLogger.warn('Server shutdown complete');
    };

    private async shutdown () {
        try {
            ServerLogger.warn('Server shutting down...');

            /* TODO: shutdown socket server */

            await this.stop()
                .then(_ => {
                    this.httpServer = null;
                    ServerLogger.info('Server shutdown successfully')
                });

            process.exit(0);
        } catch (err) {
            ServerLogger.error('Server failed to shutdown gracefully');

            process.exit(-1);
        };
    };

    private onUpgrade(req: http.IncomingMessage, socket/*: stream.Duplex*/, head: Buffer, authenticateSession) {
        //TODO: Not authenticating properly 
        authenticateSession(req as any, {} as any, () => {
            if ((req as any).session.id) {
                AppLogger.info('User session authenticated');

                const session = Object.assign({}, (req as any).session, { sessionId: `sess:${(req as any).session.id}` });

                this.SocketServer.wss.handleUpgrade(req, socket, head, (socket) => {
                    this.SocketServer.wss.emit('connection', socket, req, session);
                });
            } else {
                AppLogger.error('Invalid user session');

                socket.write(`HTTP/1.1 401 Unauthorized\r\n\r\n`);
                socket.destroy();
            };
        });
    };
};