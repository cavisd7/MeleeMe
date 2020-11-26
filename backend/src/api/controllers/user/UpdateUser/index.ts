import { UpdateUserController } from './UpdateUserController';
import { UpdateUserControllerLogic } from './UpdateUserControllerLogic';
import { userService } from '../index';

const updateUserLogic = new UpdateUserControllerLogic(userService);
const updateUserController = new UpdateUserController(updateUserLogic);

export { updateUserController };