export interface User {
    userId: string;
    username: string;
    email: string;
    netcode: string;
    avatar?: string;
    dateJoined?: Date;
};

export type UserFields = Pick<User, 'userId' | 'username' | 'netcode'>;
export interface UserMatch {
    matchId: string;
    players: UserFields[]
    isConfirmed: boolean;
};