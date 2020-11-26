
class Result<T> {
    public isSuccessful: boolean;
    public error: any;
    private _value: T;

    private constructor(isSuccessful: boolean, value?: T, error?: any) {
        this.isSuccessful = isSuccessful;
        this._value = value;
        this.error = error;

        Object.freeze(this);
    };

    public getValue () {
        return this._value;
    };

    public getError () {
        if (this.isSuccessful) {
            throw new Error('Result was successful, can not access error value');
        };

        return this.error;
    };

    public static success<V> (value?: V): Result<V> {
        return new Result<V>(true, value, null);
    };

    public static fail<V> (error: any): Result<V> {
        return new Result<V>(false, null, error);
    };
};

type Either<L, R> = Left<L> | Right<R>;

class Right<R> {
    public readonly value: R;
    public isLeft: boolean = false;
    public isRight: boolean = true;

    constructor(value: R) {
        this.value = value;
    };
};

class Left<L> {
    public readonly value: L;
    public isLeft: boolean = true;
    public isRight: boolean = false;

    constructor(value: L) {
        this.value = value;
    };
};

const left = <L>(l: L): Left<L> => {
    return new Left<L>(l);
};

const right = <R>(r: R): Right<R> => {
    return new Right<R>(r);
};

export { Result, Either, Left, Right, left, right };