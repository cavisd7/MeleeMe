import { AbstractRepository, EntityRepository } from 'typeorm';

import Repository from '..';
import { Message } from '../../entity/Message';

export interface IMessageRepository /*extends Repository<Match>*/ {};

@EntityRepository(Message)
export default class MessageRepository extends AbstractRepository<Message> implements IMessageRepository {
    async save (message: any): Promise<Message> {
        const results = await this.createQueryBuilder("m")
            .insert()
            .into(Message)
            .values({ ...message })
            .returning('*')
            .execute();
        
        return results.raw[0];
    };

    async getMessages (matchId: string): Promise<Message[]> {
        const raw = await this.createQueryBuilder("m")
            //.leftJoinAndSelect("m.messages", "mess")
            .leftJoinAndSelect("m.senderId", "u")
            .leftJoinAndSelect("m.matchId", "ma")
            .where("m.matchId = :matchId", { matchId })
            .take(20)
            .getMany()
                            
        return raw;
    }   

    async removeAllByMatch (matchId: string): Promise<void> {
        const res = await this.createQueryBuilder("m")
            .delete()
            .from(Message)
            .where("matchId = :matchId", { matchId })
            .execute();

        console.log('deleted messages', res);
        return;
    } 
};