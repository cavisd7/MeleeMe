import express from 'express';

import { BaseController } from "../../BaseController";
import { UpdateUserPasswordControllerLogic } from './UpdateUserPasswordControllerLogic'
import { IUpdateUserPasswordBody } from './schema';

class UpdateUserPasswordController extends BaseController {
    private Controllerlogic: UpdateUserPasswordControllerLogic;

    constructor(Controllerlogic: UpdateUserPasswordControllerLogic) {
        super();

        this.Controllerlogic = Controllerlogic;
    };

    public async executeImpl (req: express.Request, res: express.Response): Promise<void> {
        try {
            const result = await this.Controllerlogic.execute(req.body as IUpdateUserPasswordBody, (req.session as any).user.userId);

            if (result.isLeft) { 
                return this.errorResponse(res, result.value);
            };

            return this.ok<any>(res, result.value);
        } catch (err) {
            this.fail(res, new Error('failed in controller'));
        };
    };
};

export { UpdateUserPasswordController };    