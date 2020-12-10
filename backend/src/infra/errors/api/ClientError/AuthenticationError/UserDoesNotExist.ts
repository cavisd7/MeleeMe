import { AuthenticationError } from './index';

class UserDoesNotExist extends AuthenticationError {
    constructor(message: string) {
        super('Incorrect username or password'); //TODO
    };
};

export { UserDoesNotExist };