import { ControllerLogic } from '../../ControllerLogic';
import { IUserService } from '../UserService'
import { Either, left, right } from '../../../../infra/utils/Result';
import { UserDoesNotExist } from '../../../../infra/errors/api/ClientError/AuthenticationError/UserDoesNotExist';
import { UpdateError } from '../../../../infra/errors/api/DatabaseError/UpdateError';

type Response = Either<UserDoesNotExist | UpdateError, {avatar: string}>;

class UpdateAvatarControllerLogic implements ControllerLogic<string, Response> {
    private UserService: IUserService;

    constructor (UserService: IUserService) {
        this.UserService = UserService;
    };

    public async execute (avatars3Url: string, userId: string): Promise<Response> {
        const doesUserExist = await this.UserService.findUserByUserId(userId);
        if (!doesUserExist.isSuccessful) return left<UserDoesNotExist>(doesUserExist.getError());

        const updatedUserOrError = await this.UserService.updateUserAvatar(userId, avatars3Url);
        if (!updatedUserOrError.isSuccessful) return left<UpdateError>(updatedUserOrError.getError());

        return right<{avatar: string}>({ avatar: updatedUserOrError.getValue().avatar });
    };
};

export { UpdateAvatarControllerLogic };