/*type AuthenticationValidationErrors = 'username' | 'password';

type ValidationError<T extends string> = { [K in T]?: string };

export interface APIError {
    message: ValidationError<AuthenticationValidationErrors>;
};

const foo: APIError = { 
    message: { password: 'asdasd', username: 'asdasd' },
}*/

export type APIError<T extends string> = {
    [key in T]?: string[];
};

export interface APIErrorResponse {
    reason: string;
};

export type ValidationError<T extends string> = {
    [key in T]?: string[];
}

/*export interface APIError {
    data?: object,
    status?: number,
    statusText?: string,
    headers?: object,
    config?: object,
    request?: object
};*/