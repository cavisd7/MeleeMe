import { UpdateUserPasswordController } from './UpdateUserPasswordController';
import { UpdateUserPasswordControllerLogic } from './UpdateUserPasswordControllerLogic';
import { userService } from '../index';

const updateUserPasswordLogic = new UpdateUserPasswordControllerLogic(userService);
const updateUserPasswordController = new UpdateUserPasswordController(updateUserPasswordLogic);

export { updateUserPasswordController };