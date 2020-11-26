import { ClientError } from './index';

class ValidationError extends ClientError {
    public readonly errors: any[];

    constructor(errors: any[]) {
        super('User input did not match expectations');

        this.errors = errors
    };
};

export { ValidationError };