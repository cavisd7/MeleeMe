import { User, Token } from 'types/user';

export type AuthenticationValidationErrors = 'internal' | 'username' | 'password';

export interface UserAuthentication {
    username: string; 
    password: string;
};

export type RegistrationValidationErrors =  'username' | 'password' | 'email' | 'netcode';

export interface RegistrationInput extends UserAuthentication {
    email: string;
    netcode: string;
    confirmPassword: string;
};

export interface UserPayload {
    user: User;
    token: Token;
};

type UpdateAccountKeys = 'username' | 'email' | 'netcode';
export type UpdateAccountParams = Pick<User, UpdateAccountKeys> & { passwordConfirmation: string };
export type UpdateAccountValidationErrors = 'internal' | 'username' | 'password' | 'email' | 'netcode';

export type DeleteAccountParams = { passwordConfirmation: string };

export type UpdatePasswordParams = { 
    newPassword: string; 
    confirmNewPassword: string; 
    passwordConfirmation: string 
};