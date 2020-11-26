import React from 'react';

import {
    createStyles,
    Theme,
    withStyles,
    WithStyles
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

type Classes =
  | 'root'
  | 'value'

const styles = (theme: Theme) =>
    createStyles({
        root: {
            marginBottom: '8px'
        },
        value: {
            //padding: '0 8px', 
            color: '#606469'
        }
    });

interface Props {
    label: string;
    value: string;
}

type CombinedProps = Props & WithStyles<Classes>;

const InfoItem: React.FC<CombinedProps> = (props) => {
    const { classes, label, value } = props;

    return (
        <Grid className={classes.root} container alignItems='baseline'>
            <Grid item xs={3}>
                <Typography variant='subtitle2'>
                    <strong>
                        {label}
                    </strong>
                </Typography>
            </Grid>
            <Grid className={classes.value} item xs={9}>
                <Typography noWrap variant='subtitle2'>
                    {value}
                </Typography>
            </Grid>
        </Grid>
    );
};

const styled = withStyles(styles);

export default styled(InfoItem);