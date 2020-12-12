import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import jsCookie from 'js-cookie';

import { 
    loginUser, 
    registerUser, 
    logoutUser, 
    checkAuthentication, 
    updateAccount, 
    deleteAccount,
    updatePassword,
    updateAvatar 
} from './account.actions';

import { User, Token } from 'types/user';
import { APIErrorResponse } from 'api/types';

import { storage } from '../../storage';

export interface AccountState {
    user: User | null;
    token: Token | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: APIErrorResponse | null;
};

export const accountInitialState: AccountState = {
    user: storage.user.get() || null,
    token: storage.token.get() || null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const account: Reducer<AccountState> = (state: AccountState = accountInitialState, action) => {

    /**
     * CHECK AUTH
     */
    if (isType(action, checkAuthentication)) {
        const sessionCookie = jsCookie.get('syd')

        if (!sessionCookie) {
            storage.user.set(null);
            storage.token.set(null);

            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null
            };
        } else {
            return {
                ...state,
                error: null,
                isAuthenticated: true
            };
        }

    };

    /**
     * LOGIN
     */
    if (isType(action, loginUser.started)) {
        return {
            ...state,
            loading: true,
            error: null
        };
    };
    if (isType(action, loginUser.done)) {
        const { result: { user, token } } = action.payload;
        storage.user.set(user);
        storage.token.set(token);

        return {
            ...state,
            loading: false,
            isAuthenticated: true,
            error: null,
            user,
            token
        };
    };
    if (isType(action, loginUser.failed)) {
        const { error } = action.payload

        return {
            ...state,
            loading: false,
            isAuthenticated: false,
            error
        };
    };

    /**
     * REGISTER
     */
    if (isType(action, registerUser.started)) {
        return {
            ...state,
            error: null,
            loading: true
        };
    };
    if (isType(action, registerUser.done)) {
        const { result: { user, token } } = action.payload;
        storage.user.set(user);
        storage.token.set(token);
        
        return {
            ...state,
            loading: false,
            isAuthenticated: true,
            error: null,
            user,
            token
        };
    };
    if (isType(action, registerUser.failed)) {
        const { error } = action.payload

        return {
            ...state,
            loading: false,
            isAuthenticated: false,
            error
        };
    };

    /**
     * LOGOUT
     */
    if (isType(action, logoutUser.done)) {
        storage.user.set(null);
        storage.token.set(null);
        
        //TODO: move
        window.location.assign(process.env.NODE_ENV === 'production' ? 'https://meleeme.net' : 'http://localhost:3000/');

        return {
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
        };
    };

    /**
     * UPDATE ACCOUNT
     */
    if (isType(action, updateAccount.started)) {
        return {
            ...state,
            error: null,
            loading: true
        };
    };
    if (isType(action, updateAccount.done)) {
        const { result } = action.payload;

        storage.user.set(result);
        
        return {
            ...state,
            loading: false,
            error: null,
            user: result
        };
    };
    if (isType(action, updateAccount.failed)) {
        const { error } = action.payload

        return {
            ...state,
            loading: false,
            error
        };
    };

    /**
     * UPDATE AVATAR
     */
    if (isType(action, updateAvatar)) {
        storage.user.set(Object.assign({}, state.user, { avatar: action.payload }));

        return {
            ...state,
            user: {
                ...state.user,
                avatar: action.payload
            }
        }
    }


    /**
     * UPDATE PASSWORD
     */
    if (isType(action, updatePassword.started)) {
        return {
            ...state,
            error: null,
            loading: true
        };
    };
    if (isType(action, updatePassword.done)) {
        return {
            ...state,
            loading: false,
            error: null
        };
    };
    if (isType(action, updatePassword.failed)) {
        const { error } = action.payload

        return {
            ...state,
            loading: false,
            error
        };
    };

    /**
     * DELETE ACCOUNT
     */
    if (isType(action, deleteAccount.started)) {
        return {
            ...state,
            error: null,
            loading: true
        };
    };
    if (isType(action, deleteAccount.done)) {
        const { result } = action.payload;

        storage.user.set(null);
        storage.token.set(null);
        
        return {
            ...state,
            loading: false,
            isAuthenticated: false,
            error: null,
            token: null,
            user: null
        };
    };
    if (isType(action, deleteAccount.failed)) {
        const { error } = action.payload

        return {
            ...state,
            loading: false,
            error
        };
    };

    return state;
};

export default account;