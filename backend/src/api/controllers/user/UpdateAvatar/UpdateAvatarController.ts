import express from 'express';
import { ServerLogger } from '../../../../infra/utils/logging';

import { BaseController } from "../../BaseController";
import { UpdateAvatarControllerLogic } from './UpdateAvatarControllerLogic'

class UpdateAvatarController extends BaseController {
    private Controllerlogic: UpdateAvatarControllerLogic;

    constructor(Controllerlogic: UpdateAvatarControllerLogic) {
        super();

        this.Controllerlogic = Controllerlogic;
    };

    public async executeImpl (req: express.Request, res: express.Response): Promise<void> {
        try {
            const result = await this.Controllerlogic.execute((req as any).profilePicture, req.session.user.userId);

            if (result.isLeft) { 
                return this.errorResponse(res, result.value);
            };

            //TODO: fix session not updating
            /*const { userId, username, email, netcode, matchIds, dateJoined } = result.value as UserAuthDTO;
            req.session.user = { userId, username, email, netcode, matchIds, dateJoined };
            req.session.save(() => {
                console.log('session saved manually')
            });*/

            return this.ok<any>(res, result.value);
        } catch (err) {
            ServerLogger.error('[UpdateAvatarController] Error in controller');

            this.fail(res, new Error('failed in controller'));
        };
    };
};

export { UpdateAvatarController };    