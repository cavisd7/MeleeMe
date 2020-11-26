import { ServerError } from './index';

class HashPasswordError extends ServerError {
    constructor () {
        super('Error occurred while hashing user password');
    };
};

export { HashPasswordError };