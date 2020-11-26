import { DatabaseError } from './index';

class GenericDatabaseError extends DatabaseError {
    constructor () {
        super('Something went wrong with the database');
    };
};

export { GenericDatabaseError };