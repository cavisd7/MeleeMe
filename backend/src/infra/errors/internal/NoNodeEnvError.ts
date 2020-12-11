
export default class NoNodeEnvError extends Error {
    protected error: any;

    constructor (error?: any) {
        super('NODE_ENV was not set.');

        this.error = error;
    };
};