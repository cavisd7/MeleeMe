import * as uuid from 'uuid';

import { ISocketServer } from '../SocketServer';
import { NegotiateMatchRequest, MatchRequestId } from '../../types/matchmaking';
import { Message } from '../../types/chat';
import { Store } from '../../store';
import { ServerResponse, Payload } from '../types';

export class RoomSubscriber {
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

    public async SendChatMessage(that: ISocketServer, payload: Payload<Message>): Promise<void> {
        const usersOnServer = await this.getUsersOnServer(that, payload.payload.matchId);

        usersOnServer.forEach((userId) => {
            that.send(`ws.${userId}`, ServerResponse.NEW_CHAT_MESSAGE, payload.payload);
        });
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