import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';

import { APIError } from 'api/types';

export interface AuthenticationState {
    token: any | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: APIError<'internal'> | null;
};

export const authenticationInitialState: AuthenticationState = {
    token: {} || null,
    isAuthenticated: true,
    loading: false,
    error: null
};

const authentication: Reducer<AuthenticationState> = (state: AuthenticationState = authenticationInitialState, action) => {
    return state;
};

export default authentication;