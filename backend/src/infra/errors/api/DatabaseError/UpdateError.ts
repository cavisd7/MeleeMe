import { DatabaseError } from './index';

class UpdateError extends DatabaseError {
    constructor (mess?: string) {
        super(mess || 'Could not update entity to database');
    };
};

export { UpdateError };