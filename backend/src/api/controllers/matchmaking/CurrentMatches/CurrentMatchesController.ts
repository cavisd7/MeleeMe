import express from 'express';

import { BaseController } from "../../BaseController";
import { CurrentMatchesControllerLogic } from './CurrentMatchesControllerLogic';

class CurrentMatchesController extends BaseController {
    private Controllerlogic: CurrentMatchesControllerLogic;

    constructor (ControllerLogic: CurrentMatchesControllerLogic) {
        super();

        this.Controllerlogic = ControllerLogic;
    }

    public async executeImpl (req: express.Request, res: express.Response): Promise<void> {
        try {
            this.logger.info('matchmaking/current')
            console.log('[matchmaking/current]', req.session)

            const result = await this.Controllerlogic.execute();

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

export { CurrentMatchesController };
