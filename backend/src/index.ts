import "reflect-metadata";

/* Load .env variables */
import config from './infra/config';
import './infra/AWS';
import { ServerLogger } from './infra/utils/logging';

import { Server } from './Server';
import { createExpressApp } from './infra/loaders/expressLoader';
import { connectToDb } from './infra/loaders/dbLoader';

const initServices = async () => {
    const { default: Client } = await import('./infra/store');

    return Promise.all([
        Client.connect()
    ])
    .then(([client]) => {
        ServerLogger.info('All services initialized successfully');

        const app = createExpressApp();
        const server = new Server(app);

        return server;
    })
}

const initServer = async (config): Promise<Server> => {
    ServerLogger.info('Initializing server...');

    return connectToDb()
        .then(connection => {
            if (connection.migrations.length > 0) {
                ServerLogger.info('Running database migrations...');
                return connection.runMigrations();
            };

            return new Promise((resolve) => resolve('foo'));
        })
        .then(_ => {
            ServerLogger.info('Initializing services...');
            return initServices();
        });
};

initServer(config)
    .then(server => {
        ServerLogger.info('Server initialized successfully');
        server.start();
    })
    .catch(err => {
        ServerLogger.error('Error starting server! Stopping process...');
        setTimeout(() => {
            process.exit(-1);
        }, 100);
    });