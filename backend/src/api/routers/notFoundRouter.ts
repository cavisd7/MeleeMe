import { Router } from 'express';
import NotFound from '../controllers/NotFound';

/* Router for 404 */
const notFoundRouter = Router();

const notFound = new NotFound();

notFoundRouter.use('*', (req, res) => notFound.execute(req, res));

export { notFoundRouter };