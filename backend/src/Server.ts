import http from 'http';
import cookie from 'cookie';
import { Redis } from 'ioredis';

import { SocketManager } from './infra/socket/SocketManager';
import config from './infra/config/index';

export class Server {
    private app;
    private httpServer: http.Server;
    private SocketManager: SocketManager;
    static readonly PORT = config.serverPort;

    constructor(app: Express.Application, client: Redis) {
        //this.app = app;
        //console.log((app as any)._router.stack.filter(item => item.name === 'handleSocket'));

        this.SocketManager = new SocketManager(client);

        this.httpServer = http.createServer(app);
        this.httpServer.on('error', Server.onError);
        this.httpServer.on('listening', Server.onListening);
        this.httpServer.on('upgrade', (req, socket, head) => this.onUpgrade(req, socket, head, client));
    }

    public start() {
        this.httpServer.listen(Server.PORT);
    }

    public stop() {
        try {
            this.httpServer.close((err) => {
                if (err) {
                    console.log('Error while closing server')
                }
            })
        } catch (err) {
            console.log('catch while closing server')
        }
    }

    static onError() {
        console.log('Server encountered and error!')
    }

    static onListening() {
        console.log('Server is listening for requests')
    }

    private async onUpgrade(req: http.IncomingMessage, socket, head: Buffer, client) {
        if (req.headers.cookie) {
            const cookies = cookie.parse(req.headers.cookie);

            if (cookies['syd']) {
                const sessionId = `sess:${cookies['syd'].split('.')[0].split(':')[1]}`;

                const validSess = await client.get(sessionId)
                if (!validSess) {
                    console.log('no cookie! meeeeeee')
                    socket.write(`HTTP/1.1 401 Unauthorized\r\n\r\n`);
                    socket.destroy();
                    return;
                } else {
                        this.SocketManager.server.handleUpgrade(req, socket, head, (ws) => {
                        this.SocketManager.server.emit('connection', ws, req, sessionId)
                    });
                }
            }
        } else {
            console.log('no cookie!')
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
        }
    }
};