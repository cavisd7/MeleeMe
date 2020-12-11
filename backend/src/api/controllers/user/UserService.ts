import { getConnection } from 'typeorm';
import bcrypt from 'bcrypt';

import { UserDoesNotExist } from '../../../infra/errors/api/ClientError/AuthenticationError/UserDoesNotExist';
import { User } from '../../../domain/entity/User';
import UserRepository from '../../../domain/repository/user/UserRepository';
import { Result } from '../../../infra/utils/Result';
import { IRegisterUserBody } from './RegisterUser/schema';
import { PersistenceError } from '../../../infra/errors/api/DatabaseError/PersistenceError';
import { GenericDatabaseError } from '../../../infra/errors/api/DatabaseError/GenericDatabaseError';
import { DeletionError } from '../../../infra/errors/api/DatabaseError/DeletionError';
import { UpdateError } from '../../../infra/errors/api/DatabaseError/UpdateError';
import { ServerLogger } from '../../../infra/utils/logging';

interface IUserService {
    verifyPassword (clearPassword: string, hashedPassword: string): Promise<boolean>;
    hashPassword (password: string): Promise<string>;
    findUserByUsername (username: string): Promise<Result<User>>;
    findUserByUserId (userId: string): Promise<Result<User>>;
    createUser (user: IRegisterUserBody): Promise<Result<User>>;
    deleteUser (user: any): Promise<Result<any>>;
    updateUser (userId: string, user: { username: string, email: string, netcode: string }): Promise<Result<User>>;//TODO: fix type
    updateUserAvatar (userId: string, avatar: string): Promise<Result<User>>
    updateUserPassword (userId: string, user: { password: string }): Promise<Result<void>>;
};

class UserService implements IUserService {
    private UserRepository: UserRepository;

    constructor() {
        this.UserRepository = getConnection().getCustomRepository(UserRepository);
    };

    public async verifyPassword (clearPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(clearPassword, hashedPassword);
    };

    public hashPassword (password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    };

    public async findUserByUsername (username: string): Promise<Result<User>> {
        try {
            const userRecord = await this.UserRepository.readUserByUsername(username);

            if (!userRecord) {
                ServerLogger.debug(`${username} does not exist`);
    
                return Result.fail<User>(new UserDoesNotExist(`${username} does not exist`));
            };
    
            return Result.success<User>(userRecord);
        } catch (err) {
            ServerLogger.error(`[findUserByUsername] ${err}`);

            return Result.fail<User>(new GenericDatabaseError());
        };
    };

    public async findUserByUserId (userId: string): Promise<Result<User>> {
        try {
            const userRecord = await this.UserRepository.readUserById(userId);

            if (!userRecord) {
                return Result.fail<User>(new UserDoesNotExist(`User does not exist`));
            };

            return Result.success<User>(userRecord);
        } catch (err) {
            return Result.fail<User>(new GenericDatabaseError());
        };
    };

    public async createUser (user: IRegisterUserBody): Promise<Result<User>> {
        try {
            const newUser = await this.UserRepository.save({...user});

            if (!newUser) {
                return Result.fail<User>(new PersistenceError());
            };

            return Result.success<User>(newUser);
        } catch (err) {
            return Result.fail<User>(new GenericDatabaseError());
        };
    };

    public async deleteUser (userId: string): Promise<Result<void>> {
        try {
            await this.UserRepository.delete(userId);
    
            return Result.success<void>();
        } catch (err) {
            return Result.fail<void>(new DeletionError());
        };
    };

    public async updateUser (userId: string, user: { username: string, email: string, netcode: string }): Promise<Result<User>> {
        try {
            const updatedUser = await this.UserRepository.update(userId, user);
    
            return Result.success<User>(updatedUser);
        } catch (err) {
            return Result.fail<any>(new UpdateError());
        };
    };

    public async updateUserAvatar (userId: string, avatar: string): Promise<Result<User>> {
        try {
            const updatedUser = await this.UserRepository.update(userId, { avatar });
      
            return Result.success<User>(updatedUser);
        } catch (err) {
            return Result.fail<any>(new UpdateError('Failed to update profile picture'));
        };
    };

    public async updateUserPassword (userId: string, user: { password: string }): Promise<Result<void>> {
        try {
            await this.UserRepository.update(userId, user);
    
            return Result.success<void>();
        } catch (err) {
            return Result.fail<any>(new UpdateError());
        };
    }
};

export { IUserService, UserService };