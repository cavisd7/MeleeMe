import express from 'express';

import { ServerLogger } from '../../../infra/utils/logging';
import { BaseController } from "../BaseController";
import { ParseMatchControllerLogic } from './ParseMatchControllerLogic';

class ParseMatchController extends BaseController {
    private Controllerlogic: ParseMatchControllerLogic;

    constructor (ControllerLogic: ParseMatchControllerLogic) {
        super();

        this.Controllerlogic = ControllerLogic;
    };

    public async executeImpl (req: express.Request, res: express.Response): Promise<void> {
        try {
            if ((req as any).slpPath.length < 0) {
                return this.fail(res, 'No path to temporary slp file found.');
            };

            const result = await this.Controllerlogic.execute((req as any).slpPath);

            if (result.isLeft) { 
                return this.errorResponse(res, result.value);
            };

            return this.ok<any>(res, result.value);
        } catch (err) {
            ServerLogger.error('[ParseMatchController] Error in controller');

            return this.fail(res, err.toString());
        };
    };
};

export { ParseMatchController };
