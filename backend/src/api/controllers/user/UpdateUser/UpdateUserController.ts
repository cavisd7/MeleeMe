import express from 'express';

import { BaseController } from "../../BaseController";
import { UpdateUserControllerLogic } from './UpdateUserControllerLogic'
import { IUpdateUserBody } from './schema';
import { UserAuthDTO } from '../UserAuthDTO';

class UpdateUserController extends BaseController {
    private Controllerlogic: UpdateUserControllerLogic;

    constructor(Controllerlogic: UpdateUserControllerLogic) {
        super();

        this.Controllerlogic = Controllerlogic;
    };

    public async executeImpl (req: express.Request, res: express.Response): Promise<void> {
        try {
            const result = await this.Controllerlogic.execute(req.body as IUpdateUserBody, (req.session as any).user.userId);

            if (result.isLeft) { 
                return this.errorResponse(res, result.value);
            };

            //TODO: fix session not updating
            const { userId, username, email, netcode, matchIds, dateJoined } = result.value as UserAuthDTO;
            (req.session as any).user = { userId, username, email, netcode, matchIds, dateJoined };
            req.session.save(() => {
                console.log('session saved manually')
            });

            return this.ok<any>(res, result.value);
        } catch (err) {
            this.fail(res, new Error('failed in controller'));
        };
    };
};

export { UpdateUserController };    