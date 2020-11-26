import { Router } from 'express';

/* Routers */
import { userRouter } from './userRouter';
import { parserRouter } from './parserRouter';
import { matchmakingRouter } from './matchmakingRouter';
import { matchRouter } from './matchRouter';

/* Root router: melee.me/ */
const v1Router = Router();

/* Test route */
v1Router.get('/', (req, res) => {
    return res.status(200).send('api/v1/ default test route');
});

/* API routers */
v1Router.use('/users', userRouter);
v1Router.use('/parser', parserRouter);
v1Router.use('/matchmaking', matchmakingRouter);
v1Router.use('/match', matchRouter)

export { v1Router };