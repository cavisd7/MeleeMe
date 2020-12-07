import { ControllerLogic } from '../../ControllerLogic';
import { ILoginUserBody } from './schema';
import { IUserService } from '../UserService'
import { UserAuthDTO } from '../UserAuthDTO';
import { Either, left, right } from '../../../../infra/utils/Result';
import { toDTO } from '../UserMapper';
import { UserDoesNotExist } from '../../../errors/ClientError/AuthenticationError/UserDoesNotExist';
import { InvalidPassword } from '../../../errors/ClientError/AuthenticationError/InvalidPassword';
import { ServerLogger } from '../../../../infra/utils/logging';

type Response = Either<UserDoesNotExist | InvalidPassword, UserAuthDTO>;

class LoginUserControllerLogic implements ControllerLogic<ILoginUserBody, Response> {
    private UserService: IUserService;

    constructor (UserService: IUserService) {
        this.UserService = UserService;
    };

    /* LoginUser logic */
    public async execute (body: ILoginUserBody): Promise<Response> {
        try {
            const { username, password } = body;

            const doesUserExist = await this.UserService.findUserByUsername(username);
            if (!doesUserExist.isSuccessful) return left<UserDoesNotExist>(doesUserExist.getError());

            const isPasswordValid = await this.UserService.verifyPassword(password, doesUserExist.getValue().password)
            if (!isPasswordValid) return left<InvalidPassword>(new InvalidPassword());

            //map
            const dto = toDTO(doesUserExist.getValue());

            return right<UserAuthDTO>(dto);
        } catch (err) {
            ServerLogger.error('[LoginUserControllerLogic] Error in controller');
        };
    };
};

export { LoginUserControllerLogic };