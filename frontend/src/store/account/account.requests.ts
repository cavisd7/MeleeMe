import { createThunkRequest } from '../storeHelpers';
import { 
    loginUser as loginUserAction, 
    registerUser as registerUserAction, 
    logoutUser as logoutUserAction, 
    updateAccount as updateAccountAction,
    deleteAccount as deleteAccountAction,
    updatePassword as updatePasswordAction,  
} from './account.actions';

import { 
    registerUserRequest, 
    loginUserRequest, 
    logoutUserRequest,
    updateAccountRequest, 
    deleteAcocuntRequest,
    updatePasswordRequest 
} from 'api/account';

const registerUser = createThunkRequest(registerUserAction, ({ ...data }) => registerUserRequest(data));
const loginUser = createThunkRequest(loginUserAction, ({ ...data }) => loginUserRequest(data));
const logoutUser = createThunkRequest(logoutUserAction, () => logoutUserRequest());
const updateAccount = createThunkRequest(updateAccountAction, ({ ...data }) => updateAccountRequest(data));
const updatePassword = createThunkRequest(updatePasswordAction, ({ ...data }) => updatePasswordRequest(data));
const deleteAccount = createThunkRequest(deleteAccountAction, ({ ...data }) => deleteAcocuntRequest(data));

export { 
    registerUser, 
    loginUser,
    logoutUser, 
    updateAccount, 
    deleteAccount,
    updatePassword 
};