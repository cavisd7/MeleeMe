import { ClientError } from './index';

class UserAlreadyExists extends ClientError {
    constructor(message: string) {
        super(message);
    };
};

export { UserAlreadyExists };