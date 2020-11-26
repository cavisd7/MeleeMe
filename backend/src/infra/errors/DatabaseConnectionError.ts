
export default class DatabaseConnectionError extends Error {
    protected error: any;

    constructor (message: string, error: any) {
        super(message);

        this.error = error;
    };
};