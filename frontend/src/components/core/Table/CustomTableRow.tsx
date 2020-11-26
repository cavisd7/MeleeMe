import React from 'react';

import { WithStyles, withStyles, Theme, createStyles } from '@material-ui/core';
import TableRow, { TableRowProps } from '@material-ui/core/TableRow';

type Classes = 
    | 'root'
    | 'alternatingRow'
    ;

const styles = (theme: Theme) => (
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: '#f9f9fa !important',
            }
        },
    })
);

export interface OwnProps {};

interface Props extends TableRowProps {};

interface State {};

type CombinedProps = Props & OwnProps & WithStyles<Classes>;

class CustomTableRow extends React.Component<CombinedProps, State> {
    render () {
        const { classes, className, ...rest } = this.props;

        return (
            <TableRow
                className={[classes.root, className].join(' ')}
                {...rest}
                classes={{
                }}
            >
                {this.props.children}
            </TableRow>
        );
    };
};

const styled = withStyles(styles);

export default styled(CustomTableRow);