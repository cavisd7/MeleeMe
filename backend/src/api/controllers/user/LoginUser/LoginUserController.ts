import express from 'express';

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

            //const sessionExpiration = req.session.cookie.originalMaxAge;
            //const payload = Object.assign(result.value, { sessionExpiration });
            //console.log('pay', Date.now() + sessionExpiration);

            const authorizationToken = createToken({ foo: 'hi' });

            return this.ok<any>(res, { user: result.value, token: authorizationToken });
        } catch (err) {
            this.logger.error(`failed in controller ${err.toString()}`)
            this.fail(res, new Error('failed in controller'));
        };
    };
};

export { LoginUserController };