import { Router } from 'express';

import { getMatchMessagesController } from '../controllers/chat/GetMatchMessages/index';

import Middleware from '../Middleware';

/* Router for match related routes */
const matchRouter = Router();

const middleware = new Middleware();

/* All routes on the matchRouter */
matchRouter.get('/messages/:matchId', middleware.authenticateSession(), (req, res) => getMatchMessagesController.execute(req, res));

export { matchRouter };