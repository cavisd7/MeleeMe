import { actionCreatorFactory } from 'typescript-fsa';

import { 
    UserAuthentication, 
    UserPayload, 
    UpdateAccountParams,
    RegistrationInput,
    DeleteAccountParams,
    UpdatePasswordParams
} from 'api/account/types';
import { APIError, APIErrorResponse } from 'api/types';
import { User } from 'types/user';

const actionCreator = actionCreatorFactory('@Account');

export const updateAccount = actionCreator.async<UpdateAccountParams, User, APIErrorResponse>('UPDATE_ACCOUNT');
export const updatePassword = actionCreator.async<UpdatePasswordParams, {message: 'success'}, APIErrorResponse>('UPDATE_PASSWORD');
export const deleteAccount = actionCreator.async<DeleteAccountParams, { message: string }, APIErrorResponse>('DELETE_ACCOUNT');

export const checkAuthentication = actionCreator('CHECK_AUTHENTICATION');
export const registerUser = actionCreator.async<RegistrationInput, UserPayload, APIErrorResponse>('REGISTER_USER');
export const loginUser = actionCreator.async<UserAuthentication, UserPayload, APIErrorResponse>('LOGIN_USER');
export const logoutUser = actionCreator.async<{}, {}, APIError<'internal'>>('LOGOUT_USER');

export const updateAvatar = actionCreator<string>('UPDATE_AVATAR');
