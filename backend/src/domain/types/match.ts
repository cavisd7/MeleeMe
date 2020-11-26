import { User } from '../entity/User';

export interface MatchRequest {
    matchId: string; 
    ownerUserId: string; 
    ownerUsername: string; 
    ownerNetcode: string; 
    playingAs: string; 
    lookingToPlay: string; 
    region: string; 
    description: string;
};

export interface NegotiateMatchRequest extends MatchRequest {
    challengerUserId: string;
    challengerNetcode: string;
    challengerUsername: string; 
};

export type UserInfo = Pick<User, 'userId' | 'username' | 'netcode'>
export interface UserMatch {
    matchId: string;
    players: UserInfo[]
    isConfirmed: boolean;
};