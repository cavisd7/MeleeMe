import express from 'express';

import { ServerLogger } from '../../../../infra/utils/logging';
import { BaseController } from "../../BaseController";
import { LoginUserControllerLogic } from './LoginUserControllerLogic'
import { ILoginUserBody } from './schema';
import { UserAuthDTO } from '../UserAuthDTO';

import { createToken } from '../../../../infra/utils/token';

class LoginUserController extends BaseController {
    private Controllerlogic: LoginUserControllerLogic;

    constructor(Controllerlogic: LoginUserControllerLogic) {
        super();

        this.Controllerlogic = Controllerlogic;
    };

    public async executeImpl (req: express.Request, res: express.Response): Promise<void> {
        try {
            /* LoginUser controller's main logic */
            const result = await this.Controllerlogic.execute(req.body as ILoginUserBody);

            /* Match error to error response */
            if (result.isLeft) { 
                return this.errorResponse(res, result.value);
            };

            /* Set session */
            const { userId, username, email, netcode, matchIds, dateJoined } = result.value as UserAuthDTO;
            (req.session as any).user = { userId, username, email, netcode, matchIds, dateJoined };

            const authorizationToken = createToken({ foo: 'hi' });

            return this.ok<any>(res, { user: result.value, token: authorizationToken });
        } catch (err) {
            ServerLogger.error('[LoginUserController] Error in controller');

            this.fail(res, new Error('Error in controller'));
        };
    };
};

export { LoginUserController };