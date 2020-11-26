import { ClientError } from './index';

class AuthenticationError extends ClientError {
    constructor(message: string) {
        super(message);
    };
};

export { AuthenticationError };