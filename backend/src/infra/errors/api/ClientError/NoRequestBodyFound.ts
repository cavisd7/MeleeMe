import { ClientError } from './index';

class NoRequestBodyFound extends ClientError {
    constructor() {
        super('No request body found');
    };
};

export { NoRequestBodyFound };