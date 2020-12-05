import { ControllerLogic } from '../../ControllerLogic';
import { IUpdateUserBody } from './schema';
import { IUserService } from '../UserService'
import { UserAuthDTO } from '../UserAuthDTO';
import { Result, Either, Left, Right, left, right } from '../../../../infra/utils/Result';
import { toDTO } from '../UserMapper';
import { UserDoesNotExist } from '../../../errors/ClientError/AuthenticationError/UserDoesNotExist';
import { InvalidPassword } from '../../../errors/ClientError/AuthenticationError/InvalidPassword';
import { UpdateError } from '../../../errors/DatabaseError/UpdateError';

type Response = Either<UserDoesNotExist | InvalidPassword | UpdateError, UserAuthDTO>;

class UpdateUserControllerLogic implements ControllerLogic<IUpdateUserBody, Response> {
    private UserService: IUserService;

    constructor (UserService: IUserService) {
        this.UserService = UserService;
    };

    public async execute (body: IUpdateUserBody, userId: string): Promise<Response> {
        const { username, passwordConfirmation, email, netcode } = body;

        const doesUserExist = await this.UserService.findUserByUserId(userId);
        if (!doesUserExist.isSuccessful) return left<UserDoesNotExist>(doesUserExist.getError());

        const isPasswordValid = await this.UserService.verifyPassword(passwordConfirmation, doesUserExist.getValue().password);
        if (!isPasswordValid) return left<InvalidPassword>(new InvalidPassword());

        const updatedUserOrError = await this.UserService.updateUser(userId, { username, email, netcode });
        if (!updatedUserOrError.isSuccessful) return left<UpdateError>(updatedUserOrError.getError());

        //map
        const dto = toDTO(updatedUserOrError.getValue());

        return right<UserAuthDTO>(dto);
    };
};

export { UpdateUserControllerLogic };