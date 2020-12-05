import { Router } from 'express';

import { currentMatchesController } from '../controllers/matchmaking/CurrentMatches/index';

/* Router for user related routes */
const matchmakingRouter = Router();

/* All routes on the matchmakingRouter */
matchmakingRouter.get('/current', (req, res) => currentMatchesController.execute(req, res));

export { matchmakingRouter };