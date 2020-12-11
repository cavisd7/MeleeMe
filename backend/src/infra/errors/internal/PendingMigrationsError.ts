
export default class PendingMigrationsError extends Error {
    protected amount: any;

    constructor (amount: number) {
        super(`There are ${amount} database migrations that need to be run`);

        this.amount = amount;
    };
};