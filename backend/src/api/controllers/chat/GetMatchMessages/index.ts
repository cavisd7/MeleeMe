import { GetMatchMessagesController } from './GetMatchMessagesController';
import { GetMatchMessagesControllerLogic } from './GetMatchMessagesControllerLogic';
import { chatService } from '../../user/index';

const getMatchMessagesLogic = new GetMatchMessagesControllerLogic(chatService);
const getMatchMessagesController = new GetMatchMessagesController(getMatchMessagesLogic);

export { getMatchMessagesController };