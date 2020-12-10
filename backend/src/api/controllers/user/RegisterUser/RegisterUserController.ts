import express from 'express';

import { BaseController } from "../../BaseController";
import { RegisterUserControllerLogic } from './RegisterUserControllerLogic'
import { IRegisterUserBody } from '../RegisterUser/schema';
import { UserAuthDTO } from '../UserAuthDTO';

import { createToken } from '../../../../infra/utils/token';
import { ServerLogger } from '../../../../infra/utils/logging';

export default class RegisterUserController extends BaseController {
    private ControllerLogic: RegisterUserControllerLogic;

    constructor(ControllerLogic: RegisterUserControllerLogic) {
        super();

        this.ControllerLogic = ControllerLogic;
    };

    public async executeImpl (req: express.Request, res: express.Response): Promise<void> {
        try {
            const result = await this.ControllerLogic.execute(req.body as IRegisterUserBody);

            if (result.isLeft) return this.errorResponse(res, result.value);

            const { userId, username, email, netcode, matchIds, dateJoined } = result.value as UserAuthDTO;
            (req.session as any).user = { userId, username, email, netcode, matchIds, dateJoined };

            const authorizationToken = createToken({ foo: 'hi' });

            return this.ok<any>(res, { user: result.value, token: authorizationToken });
        } catch (err) {
            ServerLogger.error('[LoginUserController] Error in controller');
            
            this.fail(res, new Error('failed in controller'));
        };
    };
};