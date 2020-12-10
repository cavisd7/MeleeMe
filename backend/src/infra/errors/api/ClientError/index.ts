abstract class ClientError {
    public readonly message: string;

    constructor (message: string) {
        this.message = message;
    };
};

export { ClientError };