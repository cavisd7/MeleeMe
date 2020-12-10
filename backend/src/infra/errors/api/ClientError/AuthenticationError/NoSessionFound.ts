import { AuthenticationError } from './index';

class NoSessionFound extends AuthenticationError {
    constructor() {
        super('Invalid or expired session');
    };
};

export { NoSessionFound };