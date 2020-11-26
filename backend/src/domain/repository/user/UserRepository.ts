import { AbstractRepository, EntityRepository } from 'typeorm';

import Repository from '..';
import { User } from '../../entity/User';

export interface IUserRepository extends Repository<User> {
    readUserById (userId: string): Promise<User>;
    readUserByUsername (username: string): Promise<User>;
    update (userId: string, user: Partial<User>): Promise<User>;
};

@EntityRepository(User)
export default class UserRepository extends AbstractRepository<User> implements IUserRepository {

    async exists (userId: string): Promise<boolean> {
        const result = await this.createQueryBuilder("u")
            .where("user.userId = :userId", { userId })
            .getOne();

        return !!result;
    };

    /*TODO: rethink repo methods */
    public async readUserById (userId: string): Promise<User> {
        return await this.createQueryBuilder("u")
            .leftJoinAndSelect("u.matchConnection", "um")
            .where("u.userId = :userId", { userId })
            .getOne();
    };

    public async readUserByUsername (username: string): Promise<User> {
        return await this.createQueryBuilder("u")
            .leftJoinAndSelect("u.matchConnection", "um")
            .where("u.username = :username", { username })
            .getOne();
    };

    /*public async readUser (user: User): Promise<User> {
        User.find(user)
    };*/

    public async save (userData: Partial<User>): Promise<User> {
        return await this.createQueryBuilder("u")
            .insert()
            .into(User)
            .values({ ...userData })
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
    };

    /*public async delete (user: User): Promise<any> {
        return await user.remove()
            .then(res => {
                console.log(res)
            });
    };*/

    public async delete (userId: string): Promise<any> {
        return await this.createQueryBuilder("u")
            .delete()
            .from(User)
            .where("userId = :userId", { userId })
            .execute()
    };

    public async update (userId: string, user: Partial<User>): Promise<User> {
        const updatedUser = await this.createQueryBuilder("u")
            .update(User)
            .set({ ...user })
            .where("userId = :userId", { userId })
            .returning('*')
            .execute();

        return updatedUser.raw[0];
    };
};