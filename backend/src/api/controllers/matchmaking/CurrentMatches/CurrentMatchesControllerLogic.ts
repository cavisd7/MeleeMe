import { ControllerLogic } from '../../ControllerLogic';
import { Store } from '../../../../infra/store';
import { MatchRequest } from '../../../../types/matchmaking';
import { Either, left, right } from '../../../../infra/utils/Result';

type Response = Either<Error, MatchRequest[]>;

class CurrentMatchesControllerLogic implements ControllerLogic<null, Response> {
    public async execute (): Promise<Response> {
        const matchKeys = await Store.client.lrange('match_requests', 0, -1);
        const pipeline = Store.client.pipeline();

        for (let i = 0; i < matchKeys.length; i++) {
            pipeline.hgetall(`match:${matchKeys[i]}`);
        };

        const matchData = await pipeline.exec();
        
        if (!matchData) return left<Error>(new Error('Error fetching match requests from store'));

        let matches: MatchRequest[] = [];
        for (let i = 0; i < matchData.length; i++) {
            for (let j = 0; j < matchData[i].length; j++) {
                if (j == 1) {
                    matches.push(matchData[i][j]);
                };
            };
        };

        return right<MatchRequest[]>(matches);
    };
};

export { CurrentMatchesControllerLogic };