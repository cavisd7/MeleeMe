import { Router } from 'express';

import { loginUserController } from '../controllers/user/LoginUser/index';
import { registerUserController } from '../controllers/user/RegisterUser/index';
import { logoutUserController } from '../controllers/user/LogoutUser/index';
import { deleteUserController } from '../controllers/user/DeleteUser/index';
import { updateUserController } from '../controllers/user/UpdateUser/index';
import { updateAvatarController } from '../controllers/user/UpdateAvatar/index';
import { updateUserPasswordController } from '../controllers/user/UpdateUserPassword/index';
import { getMatchesController } from '../controllers/user/GetMatches/index';
import Middleware from '../Middleware';

/* Validation schemas */
import { loginUserSchema } from '../controllers/user/LoginUser/schema';
import { registerUserSchema } from '../controllers/user/RegisterUser/schema';

/* Router for user related routes */
const userRouter = Router();

const middleware = new Middleware();

/* All routes on the userRouter */
userRouter.post('/login', middleware.validate(loginUserSchema), (req, res) => loginUserController.execute(req, res));
userRouter.post('/register', middleware.validate(registerUserSchema), (req, res) => registerUserController.execute(req, res));
userRouter.post('/logout', middleware.authenticateSession(), (req, res) => logoutUserController.execute(req, res));
userRouter.delete('/delete', middleware.authenticateSession(), (req, res) => deleteUserController.execute(req, res));
userRouter.put('/update', middleware.authenticateSession(), (req, res) => updateUserController.execute(req, res));
userRouter.put('/avatar', middleware.authenticateSession(), middleware.handleProfilePictureUpload(), (req, res) => updateAvatarController.execute(req, res));
userRouter.put('/update/auth', middleware.authenticateSession(), (req, res) => updateUserPasswordController.execute(req, res));
userRouter.get('/matches', middleware.authenticateSession(), (req, res) => getMatchesController.execute(req, res));

export { userRouter };