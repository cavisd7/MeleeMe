
interface IAuthenticationErrorError {
    message: string;
}

abstract class AuthenticationError implements IAuthenticationErrorError {
    public readonly message: string;

    constructor (message: string) {
        this.message = message;
    };
};

export { AuthenticationError };