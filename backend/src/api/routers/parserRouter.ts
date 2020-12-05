import { Router } from 'express';

import { parseMatchController } from '../controllers/parser/index';

import { handleSlpFileUpload } from '../middleware/handleSlpFileUpload';

/* Router for user related routes */
const parserRouter = Router();

/* All routes on the parserRouter */
parserRouter.post('/parse', handleSlpFileUpload(), (req, res) => parseMatchController.execute(req, res));

export { parserRouter };