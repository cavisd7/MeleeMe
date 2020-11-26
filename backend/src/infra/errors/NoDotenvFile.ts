
export default class NoDotenvError extends Error {
    protected error: any;

    constructor (error?: any) {
        super('Could not find valid .env file.');

        this.error = error;
    };
};