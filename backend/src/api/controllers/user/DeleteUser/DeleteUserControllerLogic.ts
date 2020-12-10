import { ControllerLogic } from '../../ControllerLogic';
import { IDeleteUserBody } from './schema';
import { IUserService } from '../UserService'
import { Either, left, right } from '../../../../infra/utils/Result';
import { UserDoesNotExist } from '../../../../infra/errors/api/ClientError/AuthenticationError/UserDoesNotExist';
import { InvalidPassword } from '../../../../infra/errors/api/ClientError/AuthenticationError/InvalidPassword';
import { DeletionError } from '../../../../infra/errors/api/DatabaseError/DeletionError';

type Response = Either<UserDoesNotExist | InvalidPassword | DeletionError, { message: string }>;

class DeleteUserControllerLogic implements ControllerLogic<IDeleteUserBody, Response> {
    private UserService: IUserService;

    constructor (UserService: IUserService) {
        this.UserService = UserService;
    };

    public async execute (body: IDeleteUserBody, userId: string): Promise<Response> {
        const { passwordConfirmation } = body;

        const doesUserExist = await this.UserService.findUserByUserId(userId);
        if (!doesUserExist.isSuccessful) return left<UserDoesNotExist>(doesUserExist.getError());

        const isPasswordValid = await this.UserService.verifyPassword(passwordConfirmation, doesUserExist.getValue().password);
        if (!isPasswordValid) return left<InvalidPassword>(new InvalidPassword());

        const deleteUserOrError = await this.UserService.deleteUser(doesUserExist.getValue().userId);
        if (!deleteUserOrError.isSuccessful) return left<DeletionError>(deleteUserOrError.getError());

        return right<{ message: string }>({ message: 'success' });
    };
};

export { DeleteUserControllerLogic };