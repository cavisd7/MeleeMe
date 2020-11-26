export interface User {
    userId: string;
    username: string;
    avatar?: string;
    email: string;
    netcode: string;
    matchIds: string[];
    dateJoined: Date;
};

export interface Token {
    foo: string;
    iat: number;
    exp: number;
    iss: string;
}