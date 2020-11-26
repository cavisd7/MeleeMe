import { Router } from 'express';

import { currentMatchesController } from '../controllers/matchmaking/CurrentMatches/index';

import Middleware from '../Middleware';

/* Router for user related routes */
const matchmakingRouter = Router();

const middleware = new Middleware();

/* All routes on the matchmakingRouter */
matchmakingRouter.get('/current', (req, res) => currentMatchesController.execute(req, res));

export { matchmakingRouter };