import { CurrentMatchesController } from './CurrentMatchesController';
import { CurrentMatchesControllerLogic } from './CurrentMatchesControllerLogic';

const currentMatchesLogic = new CurrentMatchesControllerLogic();
const currentMatchesController = new CurrentMatchesController(currentMatchesLogic);

export { currentMatchesController };