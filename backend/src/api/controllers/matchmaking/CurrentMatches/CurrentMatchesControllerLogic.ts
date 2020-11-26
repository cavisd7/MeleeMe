import path from 'path';

import { ControllerLogic } from '../../ControllerLogic';

import { Result, Either, Left, Right, left, right } from '../../../Result';
//import RedisClient from '../../../../infra/store/RedisClient';

//TODO: move
interface MatchRequest {
    matchId: string, 
    userId: string, 
    username: string, 
    netcode: string, 
    playingAs: string,
    lookingToPlay: string,
    region: string
}

type Response = Either<Error, MatchRequest[]>;

class CurrentMatchesControllerLogic implements ControllerLogic<null, Response> {
    private store;

    constructor (store) {
        this.store = store;
    };

    public async execute (): Promise<Response> {
        const matchKeys = await this.store.lrange('match_requests', 0, -1);
        //const matchKeys = await this.store.getAllFromList('match_requests');
        //const pipeline = this.store.createPipeline();
        const pipeline = this.store.pipeline();

        for (let i = 0; i < matchKeys.length; i++) {
            pipeline.hgetall(`match:${matchKeys[i]}`);
        };

        const matchData = await pipeline.exec()
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