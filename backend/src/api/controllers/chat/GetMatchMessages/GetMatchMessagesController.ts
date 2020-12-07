import express from 'express';

import { ServerLogger } from '../../../../infra/utils/logging';
import { BaseController } from "../../BaseController";
import { GetMatchMessagesControllerLogic } from './GetMatchMessagesControllerLogic';

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
            ServerLogger.error('[GetMatchMessagesController] Error in controller');

            return this.fail(res, err.toString());
        };
    };
};

export { GetMatchMessagesController };
