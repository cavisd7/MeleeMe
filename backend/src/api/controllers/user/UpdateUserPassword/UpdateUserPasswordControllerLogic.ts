import { ControllerLogic } from '../../ControllerLogic';
import { IUpdateUserPasswordBody } from './schema';
import { IUserService } from '../UserService'
import { Either, left, right } from '../../../../infra/utils/Result';
import { UserDoesNotExist } from '../../../../infra/errors/api/ClientError/AuthenticationError/UserDoesNotExist';
import { InvalidPassword } from '../../../../infra/errors/api/ClientError/AuthenticationError/InvalidPassword';
import { UpdateError } from '../../../../infra/errors/api/DatabaseError/UpdateError';
import { HashPasswordError } from '../../../../infra/errors/api/ServerError/HashPasswordError';
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

        const updatedUserPasswordOrError = await this.UserService.updateUserPassword(userId, { password: hashPasswordOrError });
        if (!updatedUserPasswordOrError.isSuccessful) return left<UpdateError>(updatedUserPasswordOrError.getError());

        return right<SuccessDTO>({ message: 'success' });
    };
};

export { UpdateUserPasswordControllerLogic };