import { Request, generateRequest } from '../index';
import { 
    updateAccountSchema, 
} from './schemas';
import { User, Token } from 'types/user';
import { 
    UpdateAccountParams, 
    DeleteAccountParams,
    RegistrationInput, 
    UserAuthentication, 
    UpdatePasswordParams 
} from './types';

import jwt_decode from 'jwt-decode';

const registerUserRequest = (data: RegistrationInput) => {
    return generateRequest<{ user: User; token: string }>(
        Request
            .setData(data)
            .setUrl('/users/register')
            .setMethod('post')
    )
    .then(res => {
        const { user, token } = res.data;

        const decoded: Token = jwt_decode(token);

        return { user, token: decoded };
    });
};

const loginUserRequest = (data: UserAuthentication) => {
    return generateRequest<{ user: User; token: string }>(
        Request
            .setData(data)
            .setUrl('/users/login')
            .setMethod('post')
    )
    .then(res => {
        const { user, token } = res.data;

        const decoded: Token = jwt_decode(token);

        return { user, token: decoded };
    })
};

const logoutUserRequest = () => {
    return generateRequest<{}>(
        Request
            .setUrl('/users/logout')
            .setMethod('post')
    )
    .then(res => res.data);
};

const updateAccountRequest = (data: UpdateAccountParams) => {
    return generateRequest<User>(
        Request
            .setData(data, updateAccountSchema)
            .setUrl('/users/update')
            .setMethod('put')
        )
    .then(res => res.data);
};

const updatePasswordRequest = (data: UpdatePasswordParams) => {
    return generateRequest<{ message: 'success' }>(
        Request
            .setData(data)
            .setUrl('/users/update/auth')
            .setMethod('put')
        )
    .then(res => res.data);
};

const deleteAcocuntRequest = (data: DeleteAccountParams) => {
    return generateRequest<{ message: string }>(
        Request
            .setData(data)
            .setUrl('/users/delete')
            .setMethod('delete')
    )
    .then(res => res.data);
};

export { 
    registerUserRequest, 
    loginUserRequest, 
    logoutUserRequest,
    updateAccountRequest, 
    deleteAcocuntRequest,
    updatePasswordRequest 
};