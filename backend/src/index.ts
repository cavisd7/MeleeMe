import "reflect-metadata";

/* Load .env variables */
import config from './infra/config';
import { ServerLogger } from './infra/utils/logging';
import './infra/AWS';

import { IServer } from './Server';
import { connectToDb } from './infra/loaders/dbLoader';
import createSessionMiddleware from './api/middleware/createSessionMiddleware';

const initServices = async () => {
    const { Store, PubSub } = await import('./infra/store');
    const { createExpressApp } = await import('./infra/loaders/expressLoader');
    const { Server } = await import('./Server');

    return Promise.all([
        Store.connect(),
        PubSub.connect()
    ])
    .then(([store, _]) => {
        ServerLogger.info('All services initialized successfully');

        const authenticateSession = createSessionMiddleware(store);
        const app = createExpressApp(authenticateSession);
        const server = new Server(app, authenticateSession);

        return server;
    });
};

const initServer = async (): Promise<IServer> => {
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

initServer()
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