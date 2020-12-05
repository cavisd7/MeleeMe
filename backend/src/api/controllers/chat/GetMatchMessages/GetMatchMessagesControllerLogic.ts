import path from 'path';

import { ControllerLogic } from '../../ControllerLogic';
import { ChatService } from '../ChatService';
import { MatchMessagesBody } from './schema';

import { Result, Either, Left, Right, left, right } from '../../../../infra/utils/Result';
import { Message } from '../../../../domain/types/message';

type Response = Either<Error, Message[]>;

class GetMatchMessagesControllerLogic implements ControllerLogic<{ matchId: string; range: number }, Response> {
    private ChatService: ChatService;

    constructor (ChatService: ChatService) {
        this.ChatService = ChatService;
    };

    public async execute (params: { matchId: string, range: number }): Promise<Response> {
        const { matchId, range } = params;

        const matchesOrError = await this.ChatService.getMatchMessages(matchId);
        if (!matchesOrError.isSuccessful) return left<Error>(matchesOrError.getError());

        return right<Message[]>(matchesOrError.getValue());
    };
};

export { GetMatchMessagesControllerLogic };