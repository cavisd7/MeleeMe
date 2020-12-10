import { SocketHandler, SocketMessage, Payload, Channel, ServerResponse } from '../types';
import { Message } from '../../../types/chat';
import { ChatServiceInstance } from '../../../api/controllers/chat/ChatService';
import { PubSub } from '../../store';

export default class RoomHandler implements SocketHandler {
    public async exec(action: string, channel: string, payload: any): Promise<void> {
        switch(payload.type) {
            case SocketMessage.SEND_CHAT_MESSAGE:
                return await this.SendChatMessage(channel, payload);
            default:
                throw new Error('Unrecognized action in MatchmakingHandler');
        };
    };

    private async SendChatMessage(channel: string, payload: Payload<Message>): Promise<void> {
        /* Persist message in db when sender sends */
        await ChatServiceInstance.createNewMessage(payload.payload);

        await PubSub.publishToChannel(Channel.SOCKET, JSON.stringify(payload));
    };
};