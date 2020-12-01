import express from 'express';

import { ServerLogger } from '../../../../infra/utils/logging';
import { BaseController } from "../../BaseController";
import { GetMatchesControllerLogic } from './GetMatchesControllerLogic'
import { UserAuthDTO } from '../UserAuthDTO';

import { createToken } from '../../../../infra/utils/token';

class GetMatchesController extends BaseController {
    private Controllerlogic: GetMatchesControllerLogic;

    constructor(Controllerlogic: GetMatchesControllerLogic) {
        super();

        this.Controllerlogic = Controllerlogic;
    };

    public async executeImpl (req: express.Request, res: express.Response): Promise<void> {
        try {
            const { matchIds } = (req.session as any).user;

            if (matchIds.length > 0) {
                /* GetMatches controller's main logic */
                const result = await this.Controllerlogic.execute(matchIds);
    
                /* Match error to error response */
                if (result.isLeft) { 
                    return this.errorResponse(res, result.value);
                };
    
                return this.ok<any>(res, result.value);
            } else {
                return this.ok<any>(res, []);
            }

        } catch (err) {
            ServerLogger.error(`failed in controller ${err.toString()}`)
            this.fail(res, new Error('failed in controller'));
        };
    };
};

export { GetMatchesController };