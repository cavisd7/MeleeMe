import React from 'react';

import { PlayerInfo } from '../../../../store/parser/types';
import { playableCharacters } from '../../../../utils/characters';

import { makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) => ({
    characterLeft: {
        marginRight: '0.6rem'
    },
    characterRight: {
        marginLeft: '0.6rem'
    }
}));

interface Props {
    playerOne: PlayerInfo;
    playerTwo: PlayerInfo;
};

const VersusSection: React.FC<Props> = (props) => {
    const { playerOne, playerTwo } = props;

    const classes = useStyles();

    return (
        <Grid container justify='space-between' alignItems='center'>
            <Grid item md={5} xs={12} container alignItems='center' justify='center'>
                <Grid item style={{ color: '#606469' }}>
                    <Typography variant='caption'>{`Port ${playerOne.port} | ${playerOne.controllerFix}`}</Typography>
                </Grid>
                <Grid item container justify='center' alignItems='center'>
                    <Grid item style={{ color: '#3f3f3f' }}>
                        <Typography variant='subtitle2'> 
                            <strong> 
                                {playerOne.nametag || 'Player One | N/A'} 
                            </strong> 
                        </Typography>
                    </Grid>
                    <Grid item className={classes.characterRight}>
                        <img src={playableCharacters.filter(ct => ct.id === playerOne.character)[0].icon} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item md={2} xs={12} container justify='center'>
                <Grid item style={{ marginTop: '1rem', marginBottom: '1rem'  }}>
                    <Typography variant='subtitle2'>Vs</Typography>
                </Grid>
            </Grid>
            <Grid item md={5} xs={12} container alignItems='center' justify='center'>
                <Grid item style={{ color: '#606469' }}>
                    <Typography variant='caption'>{`Port ${playerTwo.port} | ${playerTwo.controllerFix}`}</Typography>
                </Grid>
                <Grid item container justify='center' alignItems='center'>
                    <Grid item className={classes.characterLeft}>
                        <img src={playableCharacters.filter(ct => ct.id === playerTwo.character)[0].icon} />
                    </Grid>
                    <Grid item style={{ color: '#3f3f3f' }}>
                        <Typography variant='subtitle2'> 
                            <strong> 
                                {playerTwo.nametag || 'Player Two | N/A'} 
                            </strong> 
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default VersusSection;