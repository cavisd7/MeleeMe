import { getConnection } from 'typeorm';

import MessageRepository from '../../../domain/repository/message/MessageRepository';
import MatchRepository from '../../../domain/repository/matchmaking/MatchRepository';

import { Message } from '../../../domain/types/message';
import { Result } from '../../Result';
import { User } from '../../../domain/entity/User';
import { UserMatch } from '../../../domain/types/match';

interface IChatService {
    createNewMessage (message: Message): Promise<void>;
    findMatches (matchIds: string[]): Promise<Result<UserMatch[]>>
}

//TODO: rename
class ChatService implements IChatService {
    //private messageRepository: MessageRepository;
    //private matchRepository: MatchRepository;

    constructor () {
        //this.messageRepository = getConnection().getCustomRepository(MessageRepository);
        //this.matchRepository = getConnection().getCustomRepository(MatchRepository);
    };
    
    public async createNewMessage (message: Message) {
        try {
            const messageRepository = getConnection().getCustomRepository(MessageRepository);
            const matchRepository = getConnection().getCustomRepository(MatchRepository);

            const { matchId, messageId, senderId, sender, text, dateSent } = message;

            const match = await matchRepository.readById(matchId);

            //TODO: handle
            if (!match) {
                console.log('NO MATCH FOUND')
                return;
            };

            //TODO: types
            await messageRepository.save(message);
        } catch (err) {
            console.log('error saving message', err)
        }
    };

    public async findMatches (matchIds: string[]): Promise<Result<UserMatch[]>> {
        try {
            const matchRepository = getConnection().getCustomRepository(MatchRepository);

            const matches = await matchRepository.readMultipleById(matchIds);

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
            return Result.fail<any>(new Error('Could not read matches'));//TODO: type error
        }
    };

    public async getMatchMessages (matchId: string): Promise<Result<Message[]>> {
        try {
            const messageRepository = getConnection().getCustomRepository(MessageRepository);
    
            const messages = await messageRepository.getMessages(matchId);
            
            const payload = messages.map((message, i) => {
                return {
                    matchId: message.matchId.matchId,
                    messageId: message.messageId,
                    senderId: message.senderId.userId,
                    avatar: message.senderId.avatar,
                    sender: message.sender,
                    text: message.text,
                    dateSent: message.dateSent
                }
            })
    
            return Result.success<Message[]>(payload);
        } catch (err) {
            return Result.fail<any>(new Error('Could not read messages'));//TODO: type error
        }
    }
};

export { ChatService };