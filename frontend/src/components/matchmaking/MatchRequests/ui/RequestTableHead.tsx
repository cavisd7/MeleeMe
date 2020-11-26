import React from 'react';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';

import RequestTableCell from './RequestTableCell';

type Classes = 'root';

const styles = (theme: Theme) =>
  createStyles({
    root: {}
  });

const rowKeys = ['Username', 'Netcode', 'Playing As', 'Looking To Play', 'Region'];

const RequestTableHead: React.StatelessComponent<WithStyles<Classes>> = (props) => {
    return (
        <TableHead>
            <TableRow>
                {
                    rowKeys.map(key => {
                        return (
                            <RequestTableCell head={true}>{key}</RequestTableCell>
                        );
                    })
                }
                <RequestTableCell head={true}></RequestTableCell>{/**TODO: better solution */}
            </TableRow>
        </TableHead>
    );
};

const styled = withStyles(styles);

export default styled(RequestTableHead);