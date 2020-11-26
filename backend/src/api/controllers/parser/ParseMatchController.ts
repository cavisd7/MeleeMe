import express from 'express';

import { BaseController } from "../BaseController";
import { ParseMatchControllerLogic } from './ParseMatchControllerLogic';

class ParseMatchController extends BaseController {
    private Controllerlogic: ParseMatchControllerLogic;

    constructor (ControllerLogic: ParseMatchControllerLogic) {
        super();

        this.Controllerlogic = ControllerLogic;
    }

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
            console.log('error in controller', err)
            return this.fail(res, err.toString());
        };
    };
};

export { ParseMatchController };
