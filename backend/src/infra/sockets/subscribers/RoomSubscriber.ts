
import { ISocketServer } from '../SocketServer';
import { Message } from '../../../types/chat';
import { Store } from '../../store';
import { ServerResponse, Payload } from '../types';

export class RoomSubscriber {
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