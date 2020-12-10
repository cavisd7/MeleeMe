import { DatabaseError } from './index';

class PersistenceError extends DatabaseError {
    constructor () {
        super('Could not persist entity to database');
    };
};

export { PersistenceError };