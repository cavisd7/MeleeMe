abstract class DatabaseError {
    public readonly message: string;

    constructor (message: string) {
        this.message = message;
    };
};

export { DatabaseError };