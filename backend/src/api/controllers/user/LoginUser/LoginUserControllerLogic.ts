import { ControllerLogic } from '../../ControllerLogic';
import { ILoginUserBody } from './schema';
import { IUserService } from '../UserService'
import { UserAuthDTO } from '../UserAuthDTO';
import { Either, left, right } from '../../../../infra/utils/Result';
import { toDTO } from '../UserMapper';
import { UserDoesNotExist } from '../../../../infra/errors/api/ClientError/AuthenticationError/UserDoesNotExist';
import { InvalidPassword } from '../../../../infra/errors/api/ClientError/AuthenticationError/InvalidPassword';

type Response = Either<UserDoesNotExist | InvalidPassword, UserAuthDTO>;

class LoginUserControllerLogic implements ControllerLogic<ILoginUserBody, Response> {
    private UserService: IUserService;

    constructor (UserService: IUserService) {
        this.UserService = UserService;
    };

    /* LoginUser logic */
    public async execute (body: ILoginUserBody): Promise<Response> {
        const { username, password } = body;

        const doesUserExist = await this.UserService.findUserByUsername(username);
        if (!doesUserExist.isSuccessful) return left<UserDoesNotExist>(doesUserExist.getError());

        const isPasswordValid = await this.UserService.verifyPassword(password, doesUserExist.getValue().password);
        if (!isPasswordValid) return left<InvalidPassword>(new InvalidPassword());

        const dto = toDTO(doesUserExist.getValue());

        return right<UserAuthDTO>(dto);
    };
};

export { LoginUserControllerLogic };