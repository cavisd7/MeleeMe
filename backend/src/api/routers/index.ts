import express, { Router } from 'express';
import os from 'os';

/* Routers */
import { v1Router } from './v1Router';
import { notFoundRouter } from './notFoundRouter';

/* Root router: melee.me/ */
const rootRouter = Router();

/* Serve bundle */
//rootRouter.use('/', express.static(path.join(__dirname, '../../../build')));

/* Combine all routers */
rootRouter.use('/api/v1', v1Router)

rootRouter.get('/', (req, res) => {
    return res.status(200).send('health check success!');
})

/* 404 handler */
rootRouter.use('*', notFoundRouter);

export { rootRouter };