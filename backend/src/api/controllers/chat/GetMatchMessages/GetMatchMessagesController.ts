import express from 'express';

import { BaseController } from "../../BaseController";
import { GetMatchMessagesControllerLogic } from './GetMatchMessagesControllerLogic';
import { MatchMessagesBody } from './schema';

class GetMatchMessagesController extends BaseController {
    private Controllerlogic: GetMatchMessagesControllerLogic;

    constructor (ControllerLogic: GetMatchMessagesControllerLogic) {
        super();

        this.Controllerlogic = ControllerLogic;
    }

    public async executeImpl (req: express.Request, res: express.Response): Promise<void> {
        try {
            const { matchId } = req.params;
            const { range } = req.query;

            const result = await this.Controllerlogic.execute({ matchId, range: Number.parseInt(range as string, 10) });

            if (result.isLeft) { 
                return this.errorResponse(res, result.value);
            };

            return this.ok<any>(res, result.value);
        } catch (err) {
            console.log('error in controller', err)
            return this.fail(res, err.toString());
        };
    };
};

export { GetMatchMessagesController };
