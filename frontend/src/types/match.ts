import { User } from './user';
import { Message } from './message';

export type PlayableCharacter = 'Mario' | 'Luigi' | 'Donkey Kong' | 'Link' | 'Samus' | 'Yoshi' | 'Kirby' | 'Fox'
    | 'Pikachu' | 'Jigglypuff' | 'C. Falcon' | 'Ness' | 'Peach' | 'Bowser' | 'Dr. Mario' | 'Zelda' | 'Sheik' | 'Young Link'
    | 'Ganondorf' | 'Falco' | 'Pichu' | 'Mewtwo' | 'Ice Climbers' | 'Marth' | 'Roy' | 'G&W' | 'Any';

export type Region = 'Europe' | 'Australia' | 'Asia' | 'South America' | 'North America' | 'Any';

export type Player = Pick<User, 'userId' | 'username' | 'netcode'> & { isOwner: boolean };
export interface Match {
    matchId: string;
    players: Player[];
    //messages: Message[];
    isConfirmed?: boolean;
};

export interface MatchRequest {
    matchId: string;
    ownerUserId: string;
    ownerUsername: string;
    ownerNetcode: string;
    avatar?: string;
    playingAs: PlayableCharacter;
    lookingToPlay: PlayableCharacter;
    region: Region;
    description?: string;
};

export interface NegotiateMatchRequest extends MatchRequest {
    challengerUserId: string;
    challengerNetcode: string;
    challengerUsername: string; 
};

type SearchableFields = 'playingAs' | 'lookingToPlay' | 'region'; 
export type MatchFilter = Pick<MatchRequest, SearchableFields>;

type MatchRequestInputFields = 'playingAs' | 'lookingToPlay' | 'region' | 'description';
export type MatchRequestInput = Pick<MatchRequest, MatchRequestInputFields>;

export type MatchNegotiationPartKeys = keyof MatchRequest;
export type MatchNegotiationPart = Pick<NegotiateMatchRequest, MatchNegotiationPartKeys>;