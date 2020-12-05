import { Request, Response, NextFunction } from 'express';

import config from '../../infra/config';
import { AppLogger } from '../../infra/utils/logging';
import { NoSessionFound } from '../errors/ClientError/AuthenticationError/NoSessionFound';

export const authenticateSession = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        AppLogger.info('[authenticateSession] Verifying user session...');

        const sessionCookieName = config.expressConfig.sessionConfig.name;
        
        //TODO: check expiration
        if (!req.cookies[sessionCookieName]) {
            AppLogger.error('[authenticateSession] No user session cookie found');

            return res.status(401).json({ error: new NoSessionFound().message });
        };

        AppLogger.info('[authenticateSession] Session verification complete');

        next();
    };
};