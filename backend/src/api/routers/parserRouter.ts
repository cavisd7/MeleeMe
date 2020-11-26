import { Router } from 'express';

import { parseMatchController } from '../controllers/parser/index';

import Middleware from '../Middleware';

/* Router for user related routes */
const parserRouter = Router();

const middleware = new Middleware();

/* All routes on the parserRouter */
parserRouter.post('/parse', middleware.handleSlpFileUpload(), (req, res) => parseMatchController.execute(req, res));

export { parserRouter };