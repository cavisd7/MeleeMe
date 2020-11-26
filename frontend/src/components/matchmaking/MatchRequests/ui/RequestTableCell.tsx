import React from 'react';

import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

type Classes = 'root' | 'head';

const styles = (theme: Theme) =>
    createStyles({
        head: {
            fontWeight: 600
        }
    });

interface Props {
    head?: boolean;
}

type CombinedProps = Props & WithStyles<Classes>;

class RequestTableCell extends React.PureComponent<CombinedProps, {}> {
    render () {
        const { classes, children, head } = this.props;

        if (head) {
            return (
                <TableCell variant='head' classes={{ head: classes.head }}>
                    <TableSortLabel> 
                        {children} 
                    </TableSortLabel>
                </TableCell>
            );
        } else {
            return (
                <TableCell variant='body'>
                    {children} 
                </TableCell>
            );
        }
    };
};

const styled = withStyles(styles);

export default styled(RequestTableCell);