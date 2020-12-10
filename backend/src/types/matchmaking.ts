export interface Match {
    matchId: string;
    ownerUserId: string; 
    ownerUsername: string;
    ownerNetcode: string;
    challengerUserId?: string;
    challengerNetcode?: string;
    challengerUsername?: string; 
    playingAs: string;
    lookingToPlay: string;
    region: string;
    description?: string;
    avatar?: string;
};

export type MatchRequestId = Pick<MatchRequest, 'matchId'>;

export type ConfirmMatch = Pick<MatchRequest, 'matchId' | 'ownerUserId'>;

export type NegotiateMatchRequest = Required<Match>;

export type MatchRequest = Omit<Match, 'challengerUserId' | 'challengerNetcode' | 'challengerUsername'>;
