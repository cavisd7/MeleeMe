import { createConnection, ConnectionOptions, Connection } from 'typeorm'

import config from '../config/index';

export const connectToDb = async (): Promise<Connection> => {
    let _connection;
    let retries = 0;
    const retryLimit = 5;

    while(retries < retryLimit) {
        try {
            await createConnection(config.dbConfig as any)
                .then(connection => {
                    console.log('Successfully connected to database!')
                    _connection = connection;
                });

            break;
        } catch (err) {
            if (retries === retryLimit - 1) throw new Error(`Could not connect to database after ${retryLimit} retries`);

            retries++;
            console.log(`Failed to connect to database. ${retryLimit - retries} retries left.`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        };
    };
    
    return _connection;
};