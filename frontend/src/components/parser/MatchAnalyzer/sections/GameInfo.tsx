import React from 'react';

import {
    createStyles,
    Theme,
    withStyles,
    WithStyles
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { SlpMatchInfo } from '../../../../store/parser/types';

import InfoItem from '../ui/InfoItem';

type Classes =
  | 'paper'
  | 'container'
  | 'title'

const styles = (theme: Theme) =>
    createStyles({
        paper: {
            marginTop: theme.spacing(2),
            padding: theme.spacing(4),
            paddingBottom: theme.spacing(2) + theme.spacing(1) / 2,
            //boxShadow: 'none'
        },
        container: {
            marginBottom: theme.spacing(1)
        },
        title: {
            marginBottom: theme.spacing(1)
        }
    });

interface Props {
    gameInfo: {
        stage: string;
        duration: string;
    };
    gameDetails: Pick<SlpMatchInfo, 'name' | 'playedOn' | 'slpVersion'>;
};

type CombinedProps = Props & WithStyles<Classes>;

const GameInfo: React.FC<CombinedProps> = (props) => {
    const {
        classes, 
        gameInfo, 
        gameDetails 
    } = props;

    const gameInfoLabels = {
        stage: 'Stage',
        duration: 'Duration'
    }

    const gameDetailsLabels = {
        name: 'File Name',
        playedOn: 'Played On',
        slpVersion: 'Slippi Version'
    }

    const mapKeysToLabels = (data: object, mapper: any): { label: string; value: string }[] => {
        return Object.entries(data).map(([dKey, dVal]) => {
            let match;
            Object.entries(mapper).forEach(([mKey, mVal]) => {
                if (dKey === mKey) {
                    match = {
                        label: mVal,
                        value: dVal
                    }  
                }
            })

            return match;
        });
    };

    return (
        <Paper className={classes.paper}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography className={classes.title} variant='h5'>Info</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    {
                        mapKeysToLabels(gameDetails, gameDetailsLabels)
                            .map(item => (
                                <InfoItem 
                                    label={item.label} 
                                    value={item.value}
                                />
                            )
                        )
                    }
                </Grid>
                <Grid item xs={12} md={6}>
                    {
                        mapKeysToLabels(gameInfo, gameInfoLabels)
                            .map(item => (
                                <InfoItem 
                                    label={item.label} 
                                    value={item.value}
                                />
                            )
                        )
                    }
                </Grid>
            </Grid>
        </Paper>
    );
}

const styled = withStyles(styles);

export default styled(GameInfo);