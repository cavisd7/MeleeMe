import React from 'react';

import {
    createStyles,
    Theme,
    Typography,
    withStyles,
    WithStyles
} from '@material-ui/core';

import Grid from '@material-ui/core/Grid';

type Classes =
    | 'container'
    ;

const styles = (theme: Theme) =>
    createStyles({
        container: {
            //width: '100%',
            padding: theme.spacing(0, 2),
            backgroundColor: '#f7f8fb',
            //color: '#62738d'
            color: 'rgba(0, 0, 0, 0.45)'
        }
    });

interface Props {};

type CombinedProps = Props & WithStyles<Classes>;

const Footer: React.FC<CombinedProps> = props => {
    const { classes } = props;

    return (
        <footer className={classes.container}>
            <Grid container justify='space-between' alignItems='center'>
                <Grid item>
                    <Typography variant='caption'>melee.me v0.0.1</Typography>
                </Grid>
                <Grid item>
                    <Typography variant='caption'>2020</Typography>
                </Grid>
            </Grid>
        </footer>
    );
}

const styled = withStyles(styles);

export default styled(Footer);