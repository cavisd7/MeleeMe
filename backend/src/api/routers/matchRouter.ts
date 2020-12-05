import { Router } from 'express';

import { getMatchMessagesController } from '../controllers/chat/GetMatchMessages/index';

import { authenticateSession } from '../middleware/authenticateSession';

/* Router for match related routes */
const matchRouter = Router();

/* All routes on the matchRouter */
matchRouter.get('/messages/:matchId', authenticateSession(), (req, res) => getMatchMessagesController.execute(req, res));

export { matchRouter };