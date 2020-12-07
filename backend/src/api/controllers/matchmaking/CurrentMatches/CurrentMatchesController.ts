import express from 'express';

import { BaseController } from "../../BaseController";
import { CurrentMatchesControllerLogic } from './CurrentMatchesControllerLogic';
import { ServerLogger } from '../../../../infra/utils/logging';

class CurrentMatchesController extends BaseController {
    private Controllerlogic: CurrentMatchesControllerLogic;

    constructor (ControllerLogic: CurrentMatchesControllerLogic) {
        super();

        this.Controllerlogic = ControllerLogic;
    }

    public async executeImpl (req: express.Request, res: express.Response): Promise<void> {
        try {
            const result = await this.Controllerlogic.execute();

            if (result.isLeft) { 
                return this.errorResponse(res, result.value);
            };

            return this.ok<any>(res, result.value);
        } catch (err) {
            ServerLogger.error('[CurrentMatchesController] Error in controller');

            return this.fail(res, err.toString());
        };
    };
};

export { CurrentMatchesController };
