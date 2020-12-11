abstract class AuthenticationError {
    public readonly message: string;

    constructor (message: string) {
        this.message = message;
    };
};

export { AuthenticationError };