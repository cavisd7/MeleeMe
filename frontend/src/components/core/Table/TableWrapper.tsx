import React from 'react';

import { makeStyles, Theme } from '@material-ui/core'; 
import Paper from '@material-ui/core/Paper'; 
import Grid from '@material-ui/core/Grid'; 

import CustomTable from './CustomTable';

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        width: '100%',
        backgroundColor: 'transparent'
    }
}));

interface Props {};

const TableWrapper: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Grid container>
                <Grid item xs={12}>
                    <CustomTable>
                        {props.children}
                    </CustomTable>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default TableWrapper;