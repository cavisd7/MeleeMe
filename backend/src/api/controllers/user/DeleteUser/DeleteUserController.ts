import express from 'express';

import { BaseController } from "../../BaseController";
import { DeleteUserControllerLogic } from './DeleteUserControllerLogic'
import { IDeleteUserBody } from './schema';

class DeleteUserController extends BaseController {
    private Controllerlogic: DeleteUserControllerLogic;

    constructor(Controllerlogic: DeleteUserControllerLogic) {
        super();

        this.Controllerlogic = Controllerlogic;
    };

    public async executeImpl (req: express.Request, res: express.Response): Promise<void> {
        try {
            const { userId } = (req.session as any).user;

            const result = await this.Controllerlogic.execute(req.body as IDeleteUserBody, userId);

            if (result.isLeft) { 
                return this.errorResponse(res, result.value);
            };

            /*Remove session from store */
            req.session.destroy(() => {
                this.logger.info('Session successfully destroyed');
            });

            /*Clear session cookie */
            res.clearCookie('syd');

            return this.ok<any>(res, result.value);
        } catch (err) {
            this.fail(res, new Error('failed in controller'));
        };
    };
};

export { DeleteUserController };