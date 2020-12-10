interface IDatabaseError {
    message: string;
};

abstract class DatabaseError implements IDatabaseError {
    public readonly message: string;

    constructor (message: string) {
        this.message = message;
    };
};

export { DatabaseError };