
interface IClientError {
    message: string;
}

abstract class ClientError implements IClientError {
    public readonly message: string;

    constructor (message: string) {
        this.message = message;
    };
};

export { ClientError };