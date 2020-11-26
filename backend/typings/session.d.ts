interface UserSession {
    userId: string,
    username: string,
    email: string,
    netcode: string,
    matchIds: string[],
    dateJoined: Date
}

declare namespace Express {
    export interface Session {
        user: UserSession;
    }
}