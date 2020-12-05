import { ControllerLogic } from '../../ControllerLogic';
import { IUpdateUserPasswordBody } from './schema';
import { IUserService } from '../UserService'
import { UserAuthDTO } from '../UserAuthDTO';
import { Result, Either, Left, Right, left, right } from '../../../../infra/utils/Result';
import { toDTO } from '../UserMapper';
import { UserDoesNotExist } from '../../../errors/ClientError/AuthenticationError/UserDoesNotExist';
import { InvalidPassword } from '../../../errors/ClientError/AuthenticationError/InvalidPassword';
import { UpdateError } from '../../../errors/DatabaseError/UpdateError';
import { HashPasswordError } from '../../../errors/ServerError/HashPasswordError';
import { SuccessDTO } from '../SuccessDTO';

type Response = Either<UserDoesNotExist | HashPasswordError | InvalidPassword | UpdateError, SuccessDTO>;

class UpdateUserPasswordControllerLogic implements ControllerLogic<IUpdateUserPasswordBody, Response> {
    private UserService: IUserService;

    constructor (UserService: IUserService) {
        this.UserService = UserService;
    };

    public async execute (body: IUpdateUserPasswordBody, userId: string): Promise<Response> {
        const { newPassword, passwordConfirmation } = body;

        const doesUserExist = await this.UserService.findUserByUserId(userId);
        if (!doesUserExist.isSuccessful) return left<UserDoesNotExist>(doesUserExist.getError());

        const isPasswordValid = await this.UserService.verifyPassword(passwordConfirmation, doesUserExist.getValue().password);
        if (!isPasswordValid) return left<InvalidPassword>(new InvalidPassword('Invalid authentication'));

        const hashPasswordOrError = await this.UserService.hashPassword(newPassword);
        if (!hashPasswordOrError.isSuccessful) return left<HashPasswordError>(hashPasswordOrError.getError());

        const updatedUserPasswordOrError = await this.UserService.updateUserPassword(userId, { password: hashPasswordOrError.getValue() });
        if (!updatedUserPasswordOrError.isSuccessful) return left<UpdateError>(updatedUserPasswordOrError.getError());

        return right<SuccessDTO>({ message: 'success' });
    };
};

export { UpdateUserPasswordControllerLogic };