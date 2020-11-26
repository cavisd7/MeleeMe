import { DeleteUserController } from './DeleteUserController';
import { DeleteUserControllerLogic } from './DeleteUserControllerLogic';
import { userService } from '../index';

const deleteUserLogic = new DeleteUserControllerLogic(userService);
const deleteUserController = new DeleteUserController(deleteUserLogic);

export { deleteUserController };