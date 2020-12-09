export interface ConfirmMatch {
    matchId: string;
    ownerId: string;
};

export interface MatchRequest {
    matchId: string;
    ownerUserId: string; 
    ownerUsername: string;
    ownerNetcode: string;
    playingAs: string;
    lookingToPlay: string;
    region: string;
    description?: string;
    avatar?: string;
};

export interface NegotiateMatchRequest extends MatchRequest {
    challengerUserId: string;
    challengerNetcode: string;
    challengerUsername: string; 
};

export type MatchRequestId = { matchId: string };