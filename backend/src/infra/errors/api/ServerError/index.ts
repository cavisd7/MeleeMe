abstract class ServerError {
    public readonly message: string;

    constructor (message: string) {
        this.message = message;
    };
};

export { ServerError };