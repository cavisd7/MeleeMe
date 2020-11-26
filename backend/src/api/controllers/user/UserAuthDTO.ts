/* /api/v1/users/login returns */
export interface UserAuthDTO {
    userId: string;
    username: string;
    email: string;
    netcode: string;
    matchIds?: string[];
    sessionExpiration?: number;
    dateJoined: Date;
};