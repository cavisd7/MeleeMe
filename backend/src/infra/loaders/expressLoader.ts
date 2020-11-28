import express, { response } from 'express';
import connect_redis from 'connect-redis';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';

import config from '../config/index';
import Client from '../store';
//import { rootRouter } from '../../api/routers/index';

interface ExpressConfig {
    foo: string
}

/*const handleSocket = () => {
    return (req, res, next) => {
        console.log('handle soc middleware')
    }
}*/

export const createExpressApp = async (/*Client: any*//*config: ExpressConfig*/) => {
    const app: express.Application = express();

    const Store = connect_redis(session);
    const handleSession = session({ 
        ...config.expressConfig.sessionConfig as any, 
        store: new Store(Client.client) 
    });
    
    /** Middleware */
    /* TODO: Set helmet config */
    app.set('trust proxy', true) // trust first proxy
    app.use(helmet());
    app.use(cors(config.expressConfig.corsConfig));
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
    app.use(express.json());
    app.use(handleSession);
    app.use(cookieParser());

    /**API Routes */
    //app.use('/', rootRouter);

    return app;
}