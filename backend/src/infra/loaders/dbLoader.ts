import { 
    createConnection, 
    ConnectionOptions, 
    Connection 
} from 'typeorm';

import config from '../config';
import { ServerLogger } from '../utils/logging';

export const connectToDb = async (): Promise<Connection> => {
    ServerLogger.info(`Attempting to connect to database @ ${config.dbConfig.host}:${config.dbConfig.port}...`);

    let _connection;
    let retries = 0;
    const retryLimit = 5;

    while(retries < retryLimit) {
        try {
            await createConnection(config.dbConfig as any)
                .then(connection => {
                    ServerLogger.info('Successfully connected to database');
                    _connection = connection;
                });

            break;
        } catch (err) {
            if (retries === retryLimit - 1) throw new Error(`Could not connect to database after ${retryLimit} retries`);

            retries++;
            ServerLogger.warn(`Failed to connect to database. ${retryLimit - retries} retries left`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        };
    };
    
    return _connection;
};