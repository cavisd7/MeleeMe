import { getConnection } from 'typeorm';
import bcrypt from 'bcrypt';

import { UserDoesNotExist } from '../../errors/ClientError/AuthenticationError/UserDoesNotExist';
import { InvalidPassword } from '../../errors/ClientError/AuthenticationError/InvalidPassword';
import { IUserRepository } from '../../../domain/repository/user/UserRepository';
import { User } from '../../../domain/entity/User';
import UserRepository from '../../../domain/repository/user/UserRepository';
import { Result } from '../../Result';
import { IRegisterUserBody } from './RegisterUser/schema';
import { PersistenceError } from '../../errors/DatabaseError/PersistenceError';
import { GenericDatabaseError } from '../../errors/DatabaseError/GenericDatabaseError';
import { DeletionError } from '../../errors/DatabaseError/DeletionError';
import { UpdateError } from '../../errors/DatabaseError/UpdateError';
import { HashPasswordError } from '../../errors/ServerError/HashPasswordError';

interface IUserService {
    verifyPassword (clearPassword: string, hashedPassword: string): Promise<boolean>;
    hashPassword (password: string): Promise<Result<string>>;
    findUserByUsername (username: string): Promise<Result<User>>;
    findUserByUserId (userId: string): Promise<Result<User>>;
    createUser (user: IRegisterUserBody): Promise<Result<User>>;
    deleteUser (user: any): Promise<Result<any>>;
    updateUser (userId: string, user: { username: string, email: string, netcode: string }): Promise<Result<User>>;//TODO: fix type
    updateUserAvatar (userId: string, avatar: string): Promise<Result<User>>
    updateUserPassword (userId: string, user: { password: string }): Promise<Result<void>>;
};

class UserService implements IUserService {
    // TODO: Constructor injection
    /*private userRepository: IUserRepository;

    constructor(@GetCustomRepo(UserRepository) private userRepository: UserRepository) {
        this.userRepository = userRepository;
    };*/

    // TODO: test
    public async verifyPassword (clearPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(clearPassword, hashedPassword);
        /*return new Promise<Result<boolean>>((resolve, reject) => {
            bcrypt.compare(clearPassword, hashedPassword, (err, same) => {
                if (err) {
                    return reject(Result.fail<boolean>(new Error('Something went wrong while verifying password')));
                };

                if (same) {
                    return resolve(Result.success<boolean>(true));
                } else {
                    return reject(Result.fail<boolean>(new InvalidPassword()));
                };
            });
        });*/
    };

    public hashPassword (password: string): Promise<Result<string>> {
        return new Promise<Result<string>>((resolve, reject) => {
            bcrypt.hash(password, 10, (err, encrypted) => {
                if (err) return reject(Result.fail<string>(new HashPasswordError()));

                return resolve(Result.success<string>(encrypted));
            });
        });
    };

    // TODO: test
    public async findUserByUsername (username: string): Promise<Result<User>> {
        try {
            const userRepository = getConnection().getCustomRepository(UserRepository);

            const userRecord = await userRepository.readUserByUsername(username);

            if (!userRecord) {
                return Result.fail<User>(new UserDoesNotExist(`${username} does not exist`));
            };

            return Result.success<User>(userRecord);
        } catch (err) {
            //presumed database error?
            return Result.fail<User>(new GenericDatabaseError());
        };
    };

    // TODO: test
    public async findUserByUserId (userId: string): Promise<Result<User>> {
        try {
            const userRepository = getConnection().getCustomRepository(UserRepository);

            const userRecord = await userRepository.readUserById(userId);

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
            const userRepository = getConnection().getCustomRepository(UserRepository);

            const newUser = await userRepository.save({...user});

            if (!newUser) {
                return Result.fail<User>(new PersistenceError());
            };

            return Result.success<User>(newUser);
        } catch (err) {
            return Result.fail<User>(new GenericDatabaseError());
        };
    };

    public async deleteUser (userId: string): Promise<Result<any>> {
        try {
            console.log('delete user', userId)
            const userRepository = getConnection().getCustomRepository(UserRepository);

            await userRepository.delete(userId);
    
            return Result.success<any>();
        } catch (err) {
            console.log('service error', err)
            return Result.fail<any>(new DeletionError());
        };
    };

    public async updateUser (userId: string, user: { username: string, email: string, netcode: string }): Promise<Result<User>> {
        try {
            const userRepository = getConnection().getCustomRepository(UserRepository);

            const updatedUser = await userRepository.update(userId, user);
    
            return Result.success<User>(updatedUser);
        } catch (err) {
            return Result.fail<any>(new UpdateError());
        };
    };

    public async updateUserAvatar (userId: string, avatar: string): Promise<Result<User>> {
        try {
            const userRepository = getConnection().getCustomRepository(UserRepository);

            const updatedUser = await userRepository.update(userId, { avatar });
      
            return Result.success<User>(updatedUser);
        } catch (err) {
            return Result.fail<any>(new UpdateError('Failed to update profile picture'));
        };
    };

    public async updateUserPassword (userId: string, user: { password: string }): Promise<Result<void>> {
        try {
            const userRepository = getConnection().getCustomRepository(UserRepository);

            await userRepository.update(userId, user);
    
            return Result.success<void>();
        } catch (err) {
            return Result.fail<any>(new UpdateError());
        };
    }
};

export { IUserService, UserService };