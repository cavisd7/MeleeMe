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
import TableBody from '@material-ui/core/TableBody';

import TableWrapper from '../../../core/Table/TableWrapper';
import ParserTableHead from '../ui/table/ParserTableHead';
import ParserTableRow from '../ui/table/ParserTableRow';

import { PlayerInfo } from '../../../../store/parser/types';

interface StatsMap {
    inputCount: string;
    conversionCount: string;
    totalDamage: string;
    killCount: string;
    neutralWinRatio: string;
    counterHitRatio: string;
};

interface ActionsMap {
    wavedashCount: string;
    wavelandCount: string;
    airDodgeCount: string;
    dashDanceCount: string;
    spotDodgeCount: string;
    ledgegrabCount: string;
    rollCount: string;
};

type Classes =
  | 'paper'
  | 'container'
  | 'title'

const styles = (theme: Theme) =>
    createStyles({
        paper: {
            marginTop: theme.spacing(2),
            padding: theme.spacing(3),
            paddingBottom: theme.spacing(2) + theme.spacing(1) / 2,
            boxShadow: 'none'
        },
        container: {
            marginBottom: theme.spacing(1)
        },
        title: {
            marginBottom: theme.spacing(1)
        }
    });

interface Props {
    playerStats: PlayerInfo[];
};

type CombinedProps = Props & WithStyles<Classes>;

const PlayerStats: React.FC<CombinedProps> = (props) => {
    const { classes, playerStats } = props;

    const statsMap: StatsMap = {
        inputCount: 'Input Count',
        conversionCount: 'Conversion Count',
        totalDamage: 'Total Damage',
        killCount: 'Kill Count',
        neutralWinRatio: 'Openings per Kill',
        counterHitRatio: 'Counter Hits'
    };

    const actionsMap: ActionsMap = {
        wavedashCount: 'Wavedash Count',
        wavelandCount: 'Waveland Count',
        airDodgeCount: 'Air Dodge Count',
        dashDanceCount: 'Dash Dance Count',
        spotDodgeCount: 'Spot Dodge Count',
        ledgegrabCount: 'Ledge Grab Count',
        rollCount: 'Roll Count',
    };

    const buildRowData = (players: PlayerInfo[], path: 'stats' | 'actions', map: StatsMap | ActionsMap): any => {
        return Object.entries(map).map(([mKey, mVal]) => {
            const rowData = players.reduce((acc, curr, i) => {
                if (typeof curr[path][mKey] === 'object' && curr[path][mKey] !== null) {
                    let val: number = curr[path][mKey]?.ratio ? curr[path][mKey].ratio : Math.floor((curr[path][mKey].count / curr[path][mKey].count) * 100);

                    return { ...acc, [`player${i}`]: `${(val * 100).toFixed(2)}%` };
                } else {
                    return { ...acc, [`player${i}`]: curr[path][mKey] };
                }
            }, {});

            return Object.assign(rowData, { colLabel: mVal });
        });
    };

    return (
        <Paper style={{ padding: '2rem' }}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography className={classes.title} variant='h5'>Combat</Typography>
                </Grid>
            </Grid>
            <Grid item xs={12} className='space-bottom' style={{ padding: '0rem' }}>
                <TableWrapper>
                    <ParserTableHead cells={[{ label: 'playerOne', playerName: playerStats[0].nametag || 'Player One' }, { label: 'playerTwo', playerName: playerStats[1].nametag || 'Player Two' }]}/>
                    <TableBody>
                        {
                            buildRowData(playerStats, 'stats', statsMap).map((stat, index) => {
                                return (
                                    <ParserTableRow 
                                        statLabel={stat.colLabel} 
                                        playerOne={stat.player0} 
                                        playerTwo={stat.player1}
                                    />
                                );
                            }) 
                        }
                    </TableBody>
                </TableWrapper>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    <Typography className={classes.title} variant='h5'>Actions</Typography>
                </Grid>
            </Grid>
            <Grid item xs={12} style={{ padding: '0rem' }}>
                <TableWrapper>
                    <ParserTableHead cells={[{ label: 'playerOne', playerName: playerStats[0].nametag || 'Player One' }, { label: 'playerTwo', playerName: playerStats[1].nametag || 'Player Two' }]}/>
                    <TableBody>
                        {
                            buildRowData(playerStats, 'actions', actionsMap).map((stat, index) => {
                                return (
                                    <ParserTableRow 
                                        statLabel={stat.colLabel} 
                                        playerOne={stat.player0} 
                                        playerTwo={stat.player1}
                                    />
                                );
                            }) 
                        }
                    </TableBody>
                </TableWrapper>
            </Grid>
        </Paper>
    );
}

const styled = withStyles(styles);

export default styled(PlayerStats);