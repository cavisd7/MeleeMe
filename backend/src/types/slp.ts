import { OverallType, ActionCountsType } from '@slippi/slippi-js';

interface SlpMatchInfo {
    name: string;
    stage: number; 
    duration: number;
    playedOn: string | null;
    //platform: string;
    slpVersion: string;
}

type PlayerStats = Omit<OverallType, 'playerIndex' | 'opponentIndex'>;
type ActionStats = Omit<ActionCountsType, 'playerIndex' | 'opponentIndex'>;

interface PlayerInfo {
    nametag: string;
    character: number; 
    port: number;
    controllerFix: string;
    stats: PlayerStats;
    actions: ActionStats;
}

export interface SlpMatchData {
    info: SlpMatchInfo;
    players: PlayerInfo[];
}