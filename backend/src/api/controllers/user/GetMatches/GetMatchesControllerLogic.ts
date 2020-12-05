import { ControllerLogic } from '../../ControllerLogic';
import { IUserService } from '../UserService'
import { UserAuthDTO } from '../UserAuthDTO';
import { Result, Either, Left, Right, left, right } from '../../../../infra/utils/Result';
import { toDTO } from '../UserMapper';
import { UserDoesNotExist } from '../../../errors/ClientError/AuthenticationError/UserDoesNotExist';
import { InvalidPassword } from '../../../errors/ClientError/AuthenticationError/InvalidPassword';
import { ChatService } from '../../chat/ChatService';
import { UserMatch } from '../../../../domain/types/match';

//TODO: error type
type Response = Either<Error, UserMatch[]>;

class GetMatchesControllerLogic implements ControllerLogic<string[], Response> {
    //private UserService: IUserService;
    private ChatService: ChatService;

    constructor (/*UserService: IUserService, */ ChatService: ChatService) {
        //this.UserService = UserService;
        this.ChatService = ChatService;
    };

    /* GetMatches logic */
    public async execute (matchIds: string[]): Promise<Response> {
        try {
            const matchesOrError = await this.ChatService.findMatches(matchIds);
            if (!matchesOrError.isSuccessful) return left<Error>(matchesOrError.getError());

            return right<UserMatch[]>(matchesOrError.getValue());
        } catch (err) {
            console.log('from logic', err)
        }
    };
};

export { GetMatchesControllerLogic };