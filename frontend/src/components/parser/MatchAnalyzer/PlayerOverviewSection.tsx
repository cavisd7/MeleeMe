import React from 'react';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import { ListItem, ListItemText } from '@material-ui/core';

import { PlayerStats, ActionStats } from '../../../store/parser/types';

interface Props {
    stats: PlayerStats;
    actions: ActionStats;
};

const PlayerOverviewSection: React.FC<Props> = (props) => {
    const { stats, actions } = props;

    return (
        <Grid container direction='column' spacing={1}>
            <Grid item>
                <List>
                    {
                        Object.entries(stats).map(([key, val]) => (
                            <ListItem>
                                <ListItemText
                                    primary={key}
                                    secondary={val.toString()}
                                />
                            </ListItem>
                        ))
                    }
                </List>
            </Grid>
            <Grid item>
                <List>
                    {
                        Object.entries(actions).map(([key, val]) => (
                            <ListItem>
                                <ListItemText
                                    primary={key}
                                    secondary={val}
                                />
                            </ListItem>
                        ))
                    }
                </List>
            </Grid>
        </Grid>
    );
}

export default PlayerOverviewSection;