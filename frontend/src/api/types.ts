export type APIError<T extends string> = {
    [key in T]?: string[];
};

export interface APIErrorResponse {
    reason: string;
};

export type ValidationError<T extends string> = {
    [key in T]?: string[];
}