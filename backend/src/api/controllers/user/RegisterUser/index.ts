import RegisterUserController from './RegisterUserController';
import { RegisterUserControllerLogic } from './RegisterUserControllerLogic';
import { userService } from '../index';

const registerUserLogic = new RegisterUserControllerLogic(userService);
const registerUserController = new RegisterUserController(registerUserLogic);

export { registerUserController };