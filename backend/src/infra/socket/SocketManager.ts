import ws, { Server } from 'ws';
import http from 'http';
import * as uuid from 'uuid';

import { PubSub, IPubSub } from '../store/PubSub'; 
import WebSocket from 'ws';
import { EventEmitter } from 'typeorm/platform/PlatformTools';
import { CreateNewMatchEmitter } from './events/matchmaking/CreateNewMatchEmitter';
import { MatchmakingEventEmitter } from './events/matchmaking/MatchmakingEventEmitter';
import { MatchmakingService } from '../../api/controllers/matchmaking/MatchmakingService'
import { ChatEventEmitter } from './events/chat/ChatEventEmitter';
import { ChatService } from '../../api/controllers/chat/ChatService'
//import { IRedisClient } from '../store/RedisClient';
import cookie from 'cookie';
import cookie_parser from 'cookie-parser';
import config from '../config/index';
import Pub, { Redis } from 'ioredis';
import { deepCopy } from '../utils/helperFunctions';
import { chatService } from '../../api/controllers/user/index';
//import RedisClient from '../store/RedisClient';

namespace ServerResponse {
    export const NEW_MATCH_REQUEST = 'NEW_MATCH_REQUEST';
    export const RECEIVED_MATCH_NEGOTIATIONS = 'RECEIVED_MATCH_NEGOTIATIONS';
    export const REMOVE_MATCH = 'REMOVE_MATCH';
    export const MATCH_REQUEST_ACK = 'MATCH_REQUEST_ACK';
    export const NEW_CHAT_MESSAGE = 'NEW_CHAT_MESSAGE';
    export const MATCH_CONFIRMED = 'MATCH_CONFIRMED';
    export const MATCH_DENIED = 'MATCH_DENIED';
    export const MATCH_DENIED_COMPLETE = 'MATCH_DENIED_COMPLETE';
    export const ERROR = 'ERROR';
}

type ServerResponseType = 
    | typeof ServerResponse.NEW_MATCH_REQUEST
    | typeof ServerResponse.RECEIVED_MATCH_NEGOTIATIONS
    | typeof ServerResponse.REMOVE_MATCH
    | typeof ServerResponse.MATCH_REQUEST_ACK
    | typeof ServerResponse.NEW_CHAT_MESSAGE
    | typeof ServerResponse.MATCH_CONFIRMED
    | typeof ServerResponse.MATCH_DENIED_COMPLETE
    | typeof ServerResponse.MATCH_DENIED
    | typeof ServerResponse.ERROR
    ;

namespace SocketMessage {
    /* Matchmaking */
    //export const NEW_MATCH = 'NEW_MATCH';
    //export const NEGOTIATE_MATCH = 'NEGOTIATE_MATCH';
    //export const MATCH_CONFIRM = 'MATCH_CONFIRM';
    //export const DENY_MATCH = 'DENY_MATCH';

    export const CREATE_MATCH_REQUEST = 'CREATE_MATCH_REQUEST';
    export const INITIATE_MATCH_NEGOTIATIONS = 'INITIATE_MATCH_NEGOTIATIONS';
    export const MATCH_REQUEST_ACK = 'MATCH_REQUEST_ACK';
    export const REMOVE_MATCH = 'REMOVE_MATCH';
    export const DENY_MATCH = 'DENY_MATCH';
    export const CONFIRM_MATCH = 'CONFIRM_MATCH';

    /* Chat */
    export const CLIENT_CHAT_MESSAGE = 'CLIENT_CHAT_MESSAGE';
};

type SocketMessageType = 
    //| typeof SocketMessage.NEW_MATCH 
    //| typeof SocketMessage.NEGOTIATE_MATCH
    //| typeof SocketMessage.MATCH_CONFIRM
    //| typeof SocketMessage.DENY_MATCH
    | typeof SocketMessage.CLIENT_CHAT_MESSAGE
    | typeof SocketMessage.CREATE_MATCH_REQUEST
    | typeof SocketMessage.INITIATE_MATCH_NEGOTIATIONS
    | typeof SocketMessage.MATCH_REQUEST_ACK
    | typeof SocketMessage.REMOVE_MATCH //TODO: move
    | typeof SocketMessage.DENY_MATCH 
    | typeof SocketMessage.CONFIRM_MATCH 

namespace Channel {
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

interface ISocketMessage {
    type: SocketMessageType;
    channel: string;
    payload: any;
};

type IRedisMessage = Pick<ISocketMessage, 'type' | 'payload'> & { socketId: string };

interface ISocketManager {
};

interface Client {
    sessionId: string;
    socket: WebSocket;
    session: any//: Express.Session;
    isAlive?: boolean;
}

export class SocketManager implements ISocketManager {
    public server: ws.Server; 
    private sub;
    private sessionClient: Redis;
    private clients: Map<string, Client>;

    //private eventEmitter: EventEmitter; 
    private createNewMatchEmitter: CreateNewMatchEmitter;
    private matchmakingEmitter: MatchmakingEventEmitter<{ any: any }>;
    private chatEmitter: ChatEventEmitter<{ any: any }>;

    constructor (sessionClient: Redis) {
        this.clients = new Map();

        this.server = new ws.Server({ noServer: true });

        this.server.on('connection', this._onConnection.bind(this));
        //this.server.on('close', () => console.log('HIIIIIIIIIIIIIIIIIIIIII'));//
        //this.server.on('error', this._onError);

        this.sessionClient = sessionClient;
        /*this.sub = new PubSub();
        this.sub.subscribeToChannels(['SERVER', 'MATCHES', 'GROUP']); //TODO: move
        this.sub.registerCallback(this._handleRedisMessage.bind(this));*/ //TODO: fix
        this.sub = new Pub(Number.parseInt(config.redisPort, 10), config.redisHost);
        this.sub.subscribe(['SERVER', 'MATCHES', 'GROUP'], (err, count) => {
            if (err) {
                console.log('error subscribing to channel')
            }
        })
        this.sub.on('message', (channel, message) => this._handleRedisMessage(channel, message));

        /**events */
        this.createNewMatchEmitter = CreateNewMatchEmitter.getInstance();

        const matchmakingService = new MatchmakingService();
        this.matchmakingEmitter = new MatchmakingEventEmitter(matchmakingService);

        //const chatService = new ChatService();
        this.chatEmitter = new ChatEventEmitter(chatService);

        setInterval(() => {
            this.clients.forEach((client) => {
                if (!client.isAlive) {
                    console.log(`client ${client.sessionId} is dead. Marking for termination`);
                    client.socket.terminate();
                    this._removeClient(`ws.${client.session.user.userId}`);
                }
                
                client.isAlive = false;
                client.socket.ping();
            })
        }, 30000)
    };

    private async _onConnection (socket: WebSocket, req: http.IncomingMessage, sessionId: string) {
        try {
            const session = await this._getSession(req)

            const socketId = `ws.${session.user.userId}`;

            //this.sub.subscribeToChannels([...session.user.matchIds]);
            if (session.user.matchIds.length > 0) {
                this.sub.subscribe([...session.user.matchIds], (err, count) => {
                    if (err) {
                        console.log('error subscribing to channel')
                    }
                })
            }
            
            //room:[matchId] = [...userId]
            const pipeline = this.sessionClient.pipeline();

            session.user.matchIds.forEach(match => {
                pipeline.sadd(`room:${match}`, session.user.userId);
            });

            await pipeline.exec();

            this._addClient(socketId, {
                sessionId,
                socket,
                session,
                isAlive: true
            });

            socket.on('message', (message: string) => this._handleSocketMessage(message, socketId, socket));
            socket.on('close', (code: number, data: string) => this._onClose(code, data, socketId));
            socket.on('error', (err: Error) => this._onError(err, socketId));
            /*socket.on('ping', (e) => {
                console.log('ping', e)
            })*/
            socket.on('pong', (e) => {
                const c = this.clients.get(socketId);
                c.isAlive = true;
            })
        } catch (err) {
            console.log('no valid session found in store. Closing socket')
            socket.terminate();
        }
    };

    private async _getSession (req: http.IncomingMessage): Promise</*Express.Session*/any> {
        const cookies = cookie.parse(req.headers.cookie);
        //console.log('[ws checkAuth] cookies: ', cookies);
        const sessionId = `sess:${cookies['syd'].split('.')[0].split(':')[1]}`;
        //console.log('[ws checkAuth] sessionId: ', sessionId);
        
        const session = await this.sessionClient.get(sessionId);

        if (!session) {
            console.log('[ws checkAuth] error getting session: ');
            return Promise.reject(new Error('No session found'));
        };

        let parsedSession;

        try {
            parsedSession = JSON.parse(session);
        } catch (err) {
            console.log('[ws checkAuth] error parsing session: ', err)
            return Promise.reject(new Error('Failed to parse session'));
        };

        return Promise.resolve(parsedSession);
    };

    private async saveSession (sessionId: string, session: any/*Express.Session*/) {
        return await this.sessionClient.set(sessionId, JSON.stringify(session));
    }

    private async _onClose (code: number, data: string, socketId: string) {
        console.log(`Socket closed: code: ${code}, data: ${data} socketId: ${socketId}`);

       /* const client = this._getClient(socketId);
        const matchIds = client.session.user.matchIds;
        const userId = socketId.split('.').pop();

        const pipeline = this.sessionClient.pipeline();

        matchIds.forEach(match => {
            pipeline.srem(`room:${match}`, userId);
        });

        await pipeline.exec();*/

        this._removeClient(socketId);
    };

    private async _onError (err: Error, socketId: string) {
        console.log(`Socket error! socketId: ${socketId} error: ${err}`);
        this._send(socketId, ServerResponse.ERROR, err)
    };

    private async _handleSocketMessage (message: string, socketId: string, socket) {
        const parsedData: ISocketMessage = this._parseMessage(message);
        const { type, channel, payload } = parsedData;

        switch (type) {
            case SocketMessage.CONFIRM_MATCH:
                const client = this._getClient(socketId);

                this.matchmakingEmitter.matchConfirmed({ matchId: payload.matchId, ownerId: client.session.user.userId });
                await this.sessionClient.publish(channel, JSON.stringify({ /*socketId,*/ type, payload, ownerId: client.session.user.userId}));
                break;
            case SocketMessage.DENY_MATCH: 
                await this.sessionClient.publish(channel, JSON.stringify({ /*socketId,*/ type, payload}));

                //TODO: might need to wait until this is done?
                this.matchmakingEmitter.cleanupDeniedMatch({ 
                    matchId: payload.matchId, 
                    ownerUserId: payload.ownerUserId, 
                    challengerUserId: payload.challengerUserId 
                });
                
                const { 
                    challengerUserId,
                    challengerNetcode,
                    challengerUsername,
                    ...rest
                } = payload;
                
                //TODO: when request is public again and someone tries to negotiate, it will try to create the same match in db again
                this.createNewMatchEmitter.emit('create_new_match_request', rest);
                //TODO: check type
                await this.sessionClient.publish(Channel.MATCHES, JSON.stringify({ /*socketId,*/ type: SocketMessage.CREATE_MATCH_REQUEST, payload: rest}));
                break;
            case SocketMessage.CREATE_MATCH_REQUEST:
                //socket.emit('error', new Error('test error'))

                //match request should be saveed to db
                this.createNewMatchEmitter.emit('create_new_match_request', payload);
                await this.sessionClient.publish(channel, JSON.stringify({ /*socketId,*/ type, payload}));
                break;
            default:
                console.log('default', {socketId, type, payload, channel})
                await this.sessionClient.publish(channel, JSON.stringify({ /*socketId,*/ type, payload}));
                break;                                     
        };
    };

    private async _handleRedisMessage (/*socketId: string,*/ channel: ChannelType, data: any) {
        const parsedData: IRedisMessage = JSON.parse(data);
        const { /*socketId,*/ type, payload } = parsedData;
        //const client = this._getClient(socketId);
        //const userId = socketId.split('.').pop();

        //console.log('REDIS MESSAGE', data, socketId, type, channel, payload)
        console.log('REDIS MESSAGE', type, channel, payload)

        switch (channel) {
            case Channel.SERVER:
                if (type === SocketMessage.INITIATE_MATCH_NEGOTIATIONS) {
                    //get owner socket on whatever server, handle no matches on other servers
                    try {
                        const client = this._getClient(`ws.${payload.ownerUserId}`);
                        const socketId = `ws.${payload.ownerUserId}`

                        //tell this redis conncetion to tell redis server that it wants to be subscribed to this channel
                        //this.sub.subscribeToChannels([payload.matchId]);
                        this.sub.subscribe([payload.matchId], (err, count) => {
                            if (err) {
                                console.log('error subscribing to channel')
                            }
                        })

                        //add to active users on match room
                        this.sessionClient.sadd(`room:${payload.matchId}`, payload.ownerUserId);

                        //persist match in db via service
                        this.matchmakingEmitter.createNewMatch(payload);
                        //TODO: add matchId to session subscriptions and client in map
                        const updatedSession = Object.assign(
                            {}, 
                            client.session, 
                            { 
                                user: { 
                                    ...client.session.user,
                                    matchIds: [...client.session.user.matchIds, payload.matchId] 
                                } 
                            }
                        );
                        console.log('UPDATED SESSION', updatedSession);
                        const savedSession = this.saveSession(client.sessionId, updatedSession);
                        if (!savedSession) console.log('[_handleRedisMessage Error] could not save session!');
                        client.session.user.matchIds.push(payload.matchId);
                        //let owner of match request know there is a negotiation happening
                        this._send(socketId, ServerResponse.RECEIVED_MATCH_NEGOTIATIONS, payload);
                        //ack for challenger so it can add information in client
                        //const ackPayload: IRedisMessage = Object.assign(payload, { type: SocketMessage.MATCH_REQUEST_ACK, socketId })
                        const ackPayload = { type: SocketMessage.MATCH_REQUEST_ACK, payload }
                        console.log('ACKPAYLOAD', ackPayload)
                        this.sessionClient.publish(Channel.SERVER, JSON.stringify(ackPayload));
                        //TODO: remove match from match request list in redis?
                        //tell all clients to remove matchId from their redux store
                        const removeMatchMessage: any/*IRedisMessage*/ = { type: SocketMessage.REMOVE_MATCH, payload: payload.matchId };
                        this.sessionClient.publish(Channel.MATCHES, JSON.stringify(removeMatchMessage));
                    } catch (_) {
                        console.log('could not find socket')
                        return;
                    }
                } else if (type === SocketMessage.MATCH_REQUEST_ACK) {
                    try {
                        const socketId = `ws.${payload.challengerUserId}`
                        const client = this._getClient(socketId);

                        //subscribe on challenger's server
                        //this.sub.subscribeToChannels([payload.matchId]);
                        this.sub.subscribe([payload.matchId], (err, count) => {
                            if (err) {
                                console.log('error subscribing to channel')
                            }
                        })

                        //add to active users on match room
                        this.sessionClient.sadd(`room:${payload.matchId}`, payload.challengerUserId);

                        //add matchId to session subscriptions
                        const updatedSession = Object.assign(
                            {}, 
                            client.session, 
                            { 
                                user: { 
                                    ...client.session.user,
                                    matchIds: [...client.session.user.matchIds, payload.matchId] 
                                } 
                            }
                        );
                        console.log('UPDATED SESSION', updatedSession);
                        const savedSession = this.saveSession(client.sessionId, updatedSession);
                        if (!savedSession) console.log('[_handleRedisMessage Error] could not save session!');
                        client.session.user.matchIds.push(payload.matchId);
                        //let challenger know about ack
                        this._send(socketId, ServerResponse.MATCH_REQUEST_ACK, payload);
                    } catch (_) {
                        console.log('could not find socket')
                        return;
                    }
                }
                break;
            case Channel.MATCHES:
                if (parsedData.type === SocketMessage.CREATE_MATCH_REQUEST) {
                    for (const keys of this.clients.keys()) {
                        this._send(keys, ServerResponse.NEW_MATCH_REQUEST, payload);
                    }
                } else if (parsedData.type === ServerResponse.REMOVE_MATCH) {
                    for (const keys of this.clients.keys()) {
                        this._send(keys, ServerResponse.REMOVE_MATCH, payload)
                    }
                }
                break;
            case Channel.GROUP:
                console.log('in group', payload, type)
                //room:[matchId] = [...userId]
                //get active users of match from redis
                const aliveUsers = await this.sessionClient.smembers(`room:${payload.matchId}`);

                const usersOnServer = aliveUsers.filter(user => {
                    const client = this._getClient(`ws.${user}`);

                    if (client) {
                        return user;
                    }
                })

                if (usersOnServer.length > 0) {
                    if (parsedData.type === SocketMessage.CLIENT_CHAT_MESSAGE) {
                        //is there more than one user on this server?
                        if (usersOnServer.length === 1) {
                            if (usersOnServer.some(user => user === payload.senderId)) {
                                this.chatEmitter.createNewMessage(payload);
                                this._send(`ws.${payload.senderId}`, ServerResponse.NEW_CHAT_MESSAGE, payload);
                            } else {
                                this._send(`ws.${usersOnServer[0]}`, ServerResponse.NEW_CHAT_MESSAGE, payload);
                            }
                        } else {//both users are on this server
                            console.log('both users on server')
                            usersOnServer.forEach(user => {
                                if (user === payload.senderId) {
                                    this.chatEmitter.createNewMessage(payload);
                                    this._send(`ws.${user}`, ServerResponse.NEW_CHAT_MESSAGE, payload);
                                } else {
                                    this._send(`ws.${user}`, ServerResponse.NEW_CHAT_MESSAGE, payload);
                                }
                            })
                        }
                    } else if (parsedData.type === SocketMessage.CONFIRM_MATCH) {
                            const { matchId, ownerId } = payload;

                            //const challenger = usersOnServer.filter(user => user !== ownerId)[0];

                            usersOnServer.forEach(user => {
                                const serverMessage = {
                                    matchId,
                                    messageId: uuid.v4(),
                                    senderId: uuid.v4(),
                                    sender: 'Server',
                                    text: 'Owner has confirmed match.',
                                    dateSent: Date.now()
                                }
                                this._send(`ws.${user}`, ServerResponse.NEW_CHAT_MESSAGE, serverMessage);

                                this._send(`ws.${user}`, ServerResponse.MATCH_CONFIRMED, { matchId });
                            })
                    } else if (parsedData.type === SocketMessage.DENY_MATCH) {
                        const { matchId } = payload;

                        usersOnServer.forEach(user => {
                            let client = this._getClient(`ws.${user}`);
                            const updatedSession = Object.assign(
                                {}, 
                                client.session, 
                                { 
                                    user: { 
                                        ...client.session.user,
                                        matchIds: client.session.user.matchIds.filter(matchId => matchId !== matchId) 
                                    } 
                                }
                            );
                            console.log('UPDATED SESSION', updatedSession);
                            const savedSession = this.saveSession(client.sessionId, updatedSession);
                            if (!savedSession) console.log('[_handleRedisMessage Error] could not save session!');
                            const i = client.session.user.matchIds.indexOf(matchId);
                            client.session.user.matchIds.splice(i, 1);
                            this._send(`ws.${user}`, ServerResponse.MATCH_DENIED, { matchId })
                        })
                    }
                }
                break;
            default: break;
        };
    };
        
    private _matchSubscriptions (channel: string, matches: string[]): string {
        const match = matches.filter(match => match === channel);
        if (match.length > 2 || match.length == 0) {
            console.log(`[matchSubscriptions]: multiple matches found with matchId: ${channel}. There should only be one.`);
            return;
        }; 
        return match[0];
    }

    private _parseMessage (data) {
        return JSON.parse(data);
    };

    private _getClient(socketId: string): Client {
        return this.clients.get(socketId);
    }

    private _send(socketId: string, type: ServerResponseType, payload: any) {
        const client = this._getClient(socketId);
        
        if (!client) {
            console.log('no client found');
            return;//handle fail
        };
        
        let message;
        
        try {
            message = this._bundleMessage(type, payload);
        } catch (err) {
            console.log('error strigifying message to send on socket', err)
        };
        console.log('SENDING SOCKET ID:', socketId, message)

        client.socket.send(message);
    };

    private _addClient(socketId: string, client: Client) {
        this.clients.set(socketId, client);

        console.log(`Connected clients ${[...this.clients.keys()]}`);
    };

    private _removeClient (socketId: string) {
        this.clients.delete(socketId);

        console.log(`Deleted client from client map. Total clients: ${this.clients.size}.`);
    };

    private _bundleMessage (type: string, payload: any) {
        return JSON.stringify({ type, payload });
    };
};