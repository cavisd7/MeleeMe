export interface ConfirmMatch {
    matchId: string;
    ownerId: string;
};

export interface CreateMatchRequest {
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

export interface DenyMatch {
    matchId: string;
    ownerUserId: string;
    ownerUsername: string;
    ownerNetcode: string;
    avatar?: string;
    playingAs: string;
    lookingToPlay: string;
    region: string;
    description?: string;
    challengerUserId: string;
    challengerNetcode: string;
    challengerUsername: string; 
};