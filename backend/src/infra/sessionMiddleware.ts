import session from 'express-session';
import connectRedis from 'connect-redis';

import config from './config/index';

const createSessionMiddleware = (client) => {
    const Store = connectRedis(session);

    return session({ 
        ...config.expressConfig.sessionConfig as any, 
        store: new Store({ client }) 
    });
};

export default createSessionMiddleware;