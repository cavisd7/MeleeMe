import { ControllerLogic } from '../../ControllerLogic';
import { IRegisterUserBody } from '../RegisterUser/schema';
import { IUserService } from '../UserService'
import { UserAuthDTO } from '../UserAuthDTO';
import { Either, left, right } from '../../../../infra/utils/Result';
import { toDTO } from '../UserMapper';
import { UserAlreadyExists } from '../../../../infra/errors/api/ClientError/UserAlreadyExists';
import { DatabaseError } from '../../../../infra/errors/api/DatabaseError';
import { HashPasswordError } from '../../../../infra/errors/api/ServerError/HashPasswordError';

type Response = Either<UserAlreadyExists | DatabaseError, UserAuthDTO>;

class RegisterUserControllerLogic implements ControllerLogic<IRegisterUserBody, Response> {
    private UserService: IUserService;

    constructor (UserService: IUserService) {
        this.UserService = UserService;
    };

    public async execute (body: IRegisterUserBody): Promise<Response> {
        const { username, password } = body;

        const doesUserExist = await this.UserService.findUserByUsername(username);
        if (doesUserExist.isSuccessful) return left<UserAlreadyExists>(new UserAlreadyExists('username is taken'));

        const hashPasswordOrError = await this.UserService.hashPassword(password);

        const user = Object.assign(body, { password: hashPasswordOrError })

        const newUserOrError = await this.UserService.createUser({ ...user });
        if (!newUserOrError.isSuccessful) return left<DatabaseError>(newUserOrError.getError()); //TODO: narrow errors

        //map
        const dto = toDTO(newUserOrError.getValue());

        return right<UserAuthDTO>(dto);
    };
};

export { RegisterUserControllerLogic };