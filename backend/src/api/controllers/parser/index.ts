import { ParseMatchController } from './ParseMatchController';
import { ParseMatchControllerLogic } from './ParseMatchControllerLogic';

const parseMatchLogic = new ParseMatchControllerLogic();
const parseMatchController = new ParseMatchController(parseMatchLogic);

export { parseMatchController };