import { AbstractRepository, EntityRepository } from 'typeorm';

import Repository from '..';
import { Match } from '../../entity/Match';
import { Message } from '../../entity/Message';

export interface IMatchRepository /*extends Repository<Match>*/ {};

@EntityRepository(Match)
export default class MatchRepository extends AbstractRepository<Match> implements IMatchRepository {
    async save (matchId: string, isConfirmed: boolean): Promise<Match> {
        const results = await this.createQueryBuilder("m")
        .insert()
        .into(Match)
        .values({ matchId, isConfirmed })
        .returning('*')
        .execute();
    
        return results.raw[0];
    };

    async readById (matchId: string): Promise<Match> {
        const raw = await this.createQueryBuilder("m")
            .leftJoinAndSelect("m.playerConnection", "um")
            .where("m.matchId = :matchId", { matchId })
            .getOne();

        return raw;
    };

    async readMultipleById (matchIds: string[]): Promise<Match[]> {
        const raw = await this.createQueryBuilder("m")
            .leftJoinAndSelect("m.playerConnection", "um")
            .leftJoinAndSelect("um.player", "u")
            //.select(["u.userId", "u.username", "u.netcode"])
            //.leftJoinAndSelect("m.messages", "mess")
            .where("m.matchId IN (:...matchId)", { matchId: matchIds })
            .getMany()
        
        return raw;
    };

    async updateMatchById (matchId: string, match: Partial<Match>): Promise<Match> {
        const results = await this.createQueryBuilder("m")
            .update(Match)
            .set({ ...match })
            .where("matchId = :matchId", { matchId })
            .returning('*')
            .execute()

        return results.raw[0];
    };

    async cleanMatchById (matchId: string, challengerId: string): Promise<void> {
        return await this.createQueryBuilder("m")
            .relation(Match, "playerConnection")
            .of(matchId)
            .remove(challengerId);
    };
};