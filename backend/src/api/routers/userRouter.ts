import { Router } from 'express';

import { loginUserController } from '../controllers/user/LoginUser/index';
import { registerUserController } from '../controllers/user/RegisterUser/index';
import { logoutUserController } from '../controllers/user/LogoutUser/index';
import { deleteUserController } from '../controllers/user/DeleteUser/index';
import { updateUserController } from '../controllers/user/UpdateUser/index';
import { updateAvatarController } from '../controllers/user/UpdateAvatar/index';
import { updateUserPasswordController } from '../controllers/user/UpdateUserPassword/index';
import { getMatchesController } from '../controllers/user/GetMatches/index';

import { authenticateSession } from '../middleware/authenticateSession';
import { handleProfileAvatarUpload } from '../middleware/handleProfileAvatarUpload';
import { validate } from '../middleware/validate';

/* Validation schemas */
import { loginUserSchema } from '../controllers/user/LoginUser/schema';
import { registerUserSchema } from '../controllers/user/RegisterUser/schema';

/* Router for user related routes */
const userRouter = Router();

/* All routes on the userRouter */
userRouter.post('/login', validate(loginUserSchema), (req, res) => loginUserController.execute(req, res));
userRouter.post('/register', validate(registerUserSchema), (req, res) => registerUserController.execute(req, res));
userRouter.post('/logout', authenticateSession(), (req, res) => logoutUserController.execute(req, res));
userRouter.delete('/delete', authenticateSession(), (req, res) => deleteUserController.execute(req, res));
userRouter.put('/update', authenticateSession(), (req, res) => updateUserController.execute(req, res));
userRouter.put('/avatar', authenticateSession(), handleProfileAvatarUpload(), (req, res) => updateAvatarController.execute(req, res));
userRouter.put('/update/auth', authenticateSession(), (req, res) => updateUserPasswordController.execute(req, res));
userRouter.get('/matches', authenticateSession(), (req, res) => getMatchesController.execute(req, res));

export { userRouter };