import { ServerError } from './index';

class GenericServerError extends ServerError {
    constructor () {
        super('Error occurred with some operation on the server');
    };
};

export { GenericServerError };