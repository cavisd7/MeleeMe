import { ClientError } from './index';

class ResourceNotFound extends ClientError {
    protected type: string;

    constructor (message: string) {
        super(message);
    };
};

export { ResourceNotFound };