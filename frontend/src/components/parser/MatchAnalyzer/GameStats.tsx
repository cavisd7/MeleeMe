import React from 'react';

import Grid from '@material-ui/core/Grid';

import { SlpMatchData } from '../../../store/parser/types';

import GameInfo from './sections/GameInfo';
import PlayerStats from './sections/PlayerStats';
import VersusSection from './sections/VersusSection';
import { getStageName } from '../../../utils/slpUtils';

interface Props {
    game: SlpMatchData
};

const GameStats: React.FC<Props> = (props) => {
    const { game: { info, players } } = props;

    const convertFrameCountToDurationString = (frames: number): string => {
        const seconds = Math.floor(frames / 60);
        const minutes = Math.floor(seconds / 60)

        return minutes + ':' + (seconds % 60 ? seconds % 60 : '00');
    }

    return (    
        <Grid container direction='column' spacing={3}>
            <Grid item>
                <VersusSection 
                    playerOne={players[0]}
                    playerTwo={players[1]}
                />
            </Grid>
            <Grid item>
                <GameInfo 
                    gameInfo={{ stage: getStageName(info.stage), duration: convertFrameCountToDurationString(info.duration) }}
                    gameDetails={{ name: info.name, playedOn: info.playedOn, slpVersion: info.slpVersion }}
                />
            </Grid>
            <Grid item>
                <PlayerStats playerStats={players}/>
            </Grid>
        </Grid>
    );  
};

export default GameStats;