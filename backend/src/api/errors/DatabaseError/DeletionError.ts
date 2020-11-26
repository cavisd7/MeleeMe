import { DatabaseError } from './index';

class DeletionError extends DatabaseError {
    constructor () {
        super('Could not delete entity from database');
    };
};

export { DeletionError };