export namespace ServerResponse {
    export const ERROR = 'ERROR';
};

export type ServerResponseType = 
    | typeof ServerResponse.ERROR
    ;