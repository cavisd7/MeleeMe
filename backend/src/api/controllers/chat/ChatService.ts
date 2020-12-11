import { getConnection } from 'typeorm';

import MessageRepository from '../../../domain/repository/message/MessageRepository';
import MatchRepository from '../../../domain/repository/matchmaking/MatchRepository';

import { Message } from '../../../types/chat';
import { Result } from '../../../infra/utils/Result';
import { UserMatch } from '../../../types/user';
import { AppLogger, ServerLogger } from '../../../infra/utils/logging';

interface IChatService {
    createNewMessage (message: Message): Promise<void>;
    findMatches (matchIds: string[]): Promise<Result<UserMatch[]>>;
    getMatchMessages (matchId: string): Promise<Result<Message[]>>;
};

//TODO: rename
class ChatService implements IChatService {
    private MatchRepository: MatchRepository;
    private MessageRepository: MessageRepository;

    constructor() {
        this.MatchRepository = getConnection().getCustomRepository(MatchRepository);
        this.MessageRepository = getConnection().getCustomRepository(MessageRepository);
    };

    public async createNewMessage (message: Message): Promise<void> {
        try {
            const { matchId, messageId, senderId, sender, text, dateSent } = message;

            const match = await this.MatchRepository.readById(matchId);

            if (!match) {
                AppLogger.error('[ChatService] Can\'t create message. No match found');
                
                throw new Error('No match found');
            };

            //TODO: types
            await this.MessageRepository.save(message);
        } catch (err) {
            ServerLogger.error('[ChatService] Error saving message');

            return Promise.reject();
        };
    };

    public async findMatches (matchIds: string[]): Promise<Result<UserMatch[]>> {
        try {
            const matches = await this.MatchRepository.readMultipleById(matchIds);

            const payload: UserMatch[] = matches.map((match) => {
                return {
                    matchId: match.matchId,
                    players: match.playerConnection.map((player, i) => {
                        return {
                            userId: match.playerConnection[i].playerId,
                            username: match.playerConnection[i].player.username,
                            netcode: match.playerConnection[i].player.netcode,
                            avatar: match.playerConnection[i].player.avatar,
                            isOwner: match.playerConnection[i].isOwner
                        }
                    }),
                    isConfirmed: match.isConfirmed
                }
            });

            return Result.success<UserMatch[]>(payload);
        } catch (err) {
            ServerLogger.error('[ChatService] Error finding matches');

            return Result.fail<any>(new Error('Could not read matches'));//TODO: type error
        };
    };

    public async getMatchMessages (matchId: string): Promise<Result<Message[]>> {
        try {
            const messages = await this.MessageRepository.getMessages(matchId);
            
            const payload = messages.map((message, i) => {
                return {
                    matchId: message.matchId.matchId,
                    messageId: message.messageId,
                    senderId: message.senderId.userId,
                    avatar: message.senderId.avatar,
                    sender: message.sender,
                    text: message.text,
                    dateSent: message.dateSent
                };
            });
    
            return Result.success<Message[]>(payload);
        } catch (err) {
            ServerLogger.error('[ChatService] Error getting match messages');

            return Result.fail<any>(new Error('Could not read messages'));//TODO: type error
        };
    };
};

const ChatServiceInstance = new ChatService();

export { ChatService, ChatServiceInstance };