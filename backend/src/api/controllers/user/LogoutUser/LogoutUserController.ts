import express from 'express';

import { ServerLogger } from '../../../../infra/utils/logging';
import { BaseController } from "../../BaseController";

export class LogoutUserController extends BaseController {

    public async executeImpl (req: express.Request, res: express.Response): Promise<void> {
        try {
            /*Remove session from store */
            req.session.destroy(() => {
                ServerLogger.info('Session successfully destroyed');
            });

            /*CLear session cookie */
            res.clearCookie('syd');
            
            return this.ok<any>(res, { message: 'success' });
        } catch (err) {
            this.fail(res, new Error('failed in controller'));
        };
    };
};