import { 
    OverallType,
    ActionCountsType 
} from '@slippi/slippi-js';

export type PlayerStats = Omit<OverallType, 'playerIndex' | 'opponentIndex'>;
export type ActionStats = Omit<ActionCountsType, 'playerIndex' | 'opponentIndex'>;

export interface SlpMatchInfo {
    name: string;
    stage: number; //map on client or server?
    duration: number;
    playedOn: string | null;
    //platform: string;
    slpVersion: string;
}

export interface PlayerInfo {
    nametag: string;
    character: number; //map where?
    port: number;
    controllerFix: string;
    stats: PlayerStats;
    actions: ActionStats;
}

export interface SlpMatchData {
    info: SlpMatchInfo;
    players: PlayerInfo[];
}

export interface ParsedSlpGames {
    [key: string]: SlpMatchData[];
}