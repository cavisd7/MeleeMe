import { UpdateAvatarController } from './UpdateAvatarController';
import { UpdateAvatarControllerLogic } from './UpdateAvatarControllerLogic';
import { userService } from '../index';

const updateAvatarLogic = new UpdateAvatarControllerLogic(userService);
const updateAvatarController = new UpdateAvatarController(updateAvatarLogic);

export { updateAvatarController };