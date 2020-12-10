import { ControllerLogic } from '../../ControllerLogic';
import { Either, left, right } from '../../../../infra/utils/Result';
import { ChatService } from '../../chat/ChatService';
import { UserMatch } from '../../../../types/user';
import { ServerLogger } from '../../../../infra/utils/logging';

//TODO: error type
type Response = Either<Error, UserMatch[]>;

class GetMatchesControllerLogic implements ControllerLogic<string[], Response> {
    private ChatService: ChatService;

    constructor (ChatService: ChatService) {
        this.ChatService = ChatService;
    };

    /* GetMatches logic */
    public async execute (matchIds: string[]): Promise<Response> {
        const matchesOrError = await this.ChatService.findMatches(matchIds);
        if (!matchesOrError.isSuccessful) return left<Error>(matchesOrError.getError());

        return right<UserMatch[]>(matchesOrError.getValue());
    };
};

export { GetMatchesControllerLogic };