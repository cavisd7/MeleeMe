import { LoginUserController } from './LoginUserController';
import { LoginUserControllerLogic } from './LoginUserControllerLogic';
import { userService } from '../index';

const loginUserLogic = new LoginUserControllerLogic(userService);
const loginUserController = new LoginUserController(loginUserLogic);

export { loginUserController };