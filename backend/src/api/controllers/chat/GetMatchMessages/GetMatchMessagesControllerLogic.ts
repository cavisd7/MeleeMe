import { ControllerLogic } from '../../ControllerLogic';
import { ChatService } from '../ChatService';
import { GetMatchMessagesBody } from './schema';

import { Either, left, right } from '../../../../infra/utils/Result';
import { Message } from '../../../../types/chat';

type Response = Either<Error, Message[]>;

class GetMatchMessagesControllerLogic implements ControllerLogic<GetMatchMessagesBody, Response> {
    private ChatService: ChatService;

    constructor (ChatService: ChatService) {
        this.ChatService = ChatService;
    };

    public async execute (params: GetMatchMessagesBody): Promise<Response> {
        const { matchId, range } = params;

        const matchesOrError = await this.ChatService.getMatchMessages(matchId);
        if (!matchesOrError.isSuccessful) return left<Error>(matchesOrError.getError());

        return right<Message[]>(matchesOrError.getValue());
    };
};

export { GetMatchMessagesControllerLogic };