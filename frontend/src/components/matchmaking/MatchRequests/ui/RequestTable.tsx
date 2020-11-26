import React from 'react';

import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';

import RequestTableHead from './RequestTableHead';

type Classes = 'paper';

const styles = (theme: Theme) =>
  createStyles({
        paper: {
            boxShadow: '0 2px 4px rgba(0,0,0,.1)'
        }
  });

interface Props {
    length: number;
};

type CombinedProps = Props & WithStyles<Classes>;

const RequestTable: React.StatelessComponent<CombinedProps> = (props) => {
    const { classes, length } = props;

    return (
        <Paper className={classes.paper}>
            <Table
                aria-label='Match Requests'
                aria-colcount={10}
                aria-rowcount={length}
                role="table"
            >
                <RequestTableHead />
                {props.children}
            </Table>
        </Paper>
    );
};

const styled = withStyles(styles);

export default styled(RequestTable);