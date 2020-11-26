interface IServerError {
    message: string;
};

abstract class ServerError implements IServerError {
    public readonly message: string;

    constructor (message: string) {
        this.message = message;
    };
};

export { ServerError };