import { GetMatchesController } from './GetMatchesController';
import { GetMatchesControllerLogic } from './GetMatchesControllerLogic';
import { chatService } from '../index';

const getMatchesLogic = new GetMatchesControllerLogic(chatService);
const getMatchesController = new GetMatchesController(getMatchesLogic);

export { getMatchesController };