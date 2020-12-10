import * as uuid from 'uuid';

import { ServerResponse, Channel, SocketMessage, Payload } from '../types';
import { ISocketServer } from '../SocketServer';
import { MatchRequest, NegotiateMatchRequest, MatchRequestId } from '../../../types/matchmaking';
import { PubSub, Store } from '../../store';
import { MatchmakingServiceInstance } from '../../../api/controllers/matchmaking/MatchmakingService';
import { ServerLogger } from '../../utils/logging';

export class MatchmakingSubscriber {
    //TODO: change name
    public async CreateMatchRequest(that: ISocketServer, payload: Payload<MatchRequest>) {
        that.sendToAllClients(ServerResponse.NEW_MATCH_REQUEST, payload.payload);
    };

    public async RemoveMatchRequest(that: ISocketServer, payload: Payload<MatchRequestId>) {
        that.sendToAllClients(ServerResponse.REMOVE_MATCH_REQUEST, payload.payload);
    };

    public async InitiateMatchNegotiations(that: ISocketServer, payload: Payload<NegotiateMatchRequest>): Promise<void> {
        const ownerClient = that.getClient(`ws.${payload.payload.ownerUserId}`);

        if (!ownerClient) {
            ServerLogger.warn('Match owner not found on current server');
            return;
        };

        /* Subscribe to new match room */
        await PubSub.subscribeToChannels([payload.payload.matchId]);

        /* Add owner to active users in match room */
        /*TODO: Add to Store API */
        Store.client.sadd(`room:${payload.payload.matchId}`, payload.payload.ownerUserId);

        /* Persist match in db */
        await MatchmakingServiceInstance.createNewMatch(payload.payload);

        /* Update owner's session */
        /*TODO: Add to Store API */
        const updatedSession = Object.assign({}, ownerClient.session, {
            user: {
                ...ownerClient.session.user,
                matchIds: [...ownerClient.session.user.matchIds, payload.payload.matchId] 
            }
        });
        await Store.client.set(ownerClient.sessionId, JSON.stringify(updatedSession));

        /* Update client state thats stored in the socket server */
        ownerClient.session.user.matchIds.push(payload.payload.matchId);

        /* Let owner of match request know there is a negotiation happening */
        that.send(ownerClient.socket.id,  ServerResponse.RECEIVED_MATCH_NEGOTIATIONS, payload.payload);

        /* Let challenger know match negotiations were received */
        //TODO: fix response type
        PubSub.publishToChannel(Channel.SOCKET, JSON.stringify({ type: `matchmaking:${ServerResponse.MATCH_REQUEST_ACK}`, payload: payload.payload }));

        /* Remove match request from public list */
        //TODO: fix response type
        PubSub.publishToChannel(Channel.SOCKET, JSON.stringify({ type: `matchmaking:${ServerResponse.REMOVE_MATCH_REQUEST}`, payload: payload.payload.matchId }))
    };

    public async MatchRequestAck(that: ISocketServer, payload: Payload<NegotiateMatchRequest>): Promise<void> {
        const challengerClient = that.getClient(`ws.${payload.payload.challengerUserId}`);

        if (!challengerClient) {
            ServerLogger.warn('Match challenger not found on current server');
            return;
        };

        /* Subscribe to new match room */
        await PubSub.subscribeToChannels([payload.payload.matchId]);

        /* Add challenger to active users in match room */
        Store.client.sadd(`room:${payload.payload.matchId}`, payload.payload.challengerUserId);

        /* Update challenger's session */
        const updatedSession = Object.assign({}, challengerClient.session, {
            user: {
                ...challengerClient.session.user,
                matchIds: [...challengerClient.session.user.matchIds, payload.payload.matchId] 
            }
        });
        await Store.client.set(challengerClient.sessionId, JSON.stringify(updatedSession));

        /* Update client state thats stored in the socket server */
        challengerClient.session.user.matchIds.push(payload.payload.matchId);

        //let challenger know about ack
        that.send(challengerClient.socket.id, ServerResponse.MATCH_REQUEST_ACK, payload.payload);
    };

    public async ConfirmMatch(that: ISocketServer, payload: Payload<MatchRequestId>): Promise<void> {
        const usersOnServer = await this.getUsersOnServer(that, payload.payload.matchId);

        usersOnServer.forEach((userId) => {
            const serverMessage = {
                matchId: payload.payload.matchId,
                messageId: uuid.v4(),
                senderId: uuid.v4(),
                sender: 'Server',
                text: 'Owner has confirmed match.',
                dateSent: Date.now()
            }

            that.send(`ws.${userId}`, ServerResponse.NEW_CHAT_MESSAGE, serverMessage);
            that.send(`ws.${userId}`, ServerResponse.MATCH_CONFIRMED, payload.payload);
        });
    };

    public async DenyMatch(that: ISocketServer, payload: Payload<NegotiateMatchRequest>): Promise<void> {
        const usersOnServer = await this.getUsersOnServer(that, payload.payload.matchId);
        
        usersOnServer.forEach((userId) => {
            const client = that.getClient(`ws.${userId}`);

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

            //TODO
            Store.client.set(client.sessionId, JSON.stringify(updatedSession));

            const disbandedMatch = client.session.user.matchIds.indexOf(payload.payload.matchId);
            client.session.user.matchIds.splice(disbandedMatch, 1);

            that.send(client.socket.id, ServerResponse.MATCH_DENIED, payload.payload);
        })
    };

    //TODO
    private async getUsersOnServer(wss: ISocketServer, matchId: string): Promise<string[]> {
        const aliveUsers = await Store.client.smembers(`room:${matchId}`);

        return aliveUsers.filter(userId => {
            const client = wss.getClient(`ws.${userId}`);

            if (client) {
                return userId;
            };
        })
    };
};