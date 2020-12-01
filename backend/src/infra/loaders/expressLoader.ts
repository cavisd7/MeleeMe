import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import config from '../config/index';
import { rootRouter } from '../../api/routers/index';

export const createExpressApp = (authenticateSession) => {
    const app: express.Application = express();
    
    /* Trust first proxy if running in production */
    process.env.NODE_ENV === 'production' && app.set('trust proxy', true);
    app.disable('x-powered-by');
    
    /** Middleware */
    /* TODO: Set helmet config */
    app.use(helmet());
    app.use(cors(config.expressConfig.corsConfig));
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
    app.use(express.json());
    app.use(authenticateSession);
    app.use(cookieParser());

    /* API Routes */
    app.use('/', rootRouter);

    return app;
};