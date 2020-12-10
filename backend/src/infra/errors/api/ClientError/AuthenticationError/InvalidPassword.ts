import { AuthenticationError } from './index';

class InvalidPassword extends AuthenticationError {
    constructor(message?: string) {
        super(message || 'Incorrect username or password'); //TODO
    };
};

export { InvalidPassword };