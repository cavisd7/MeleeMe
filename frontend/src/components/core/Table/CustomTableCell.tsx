import React from 'react';

import { makeStyles, Theme } from '@material-ui/core'; 
import TableCell, { TableCellProps } from '@material-ui/core/TableCell'; 
import TableSortLabel from '@material-ui/core/TableSortLabel'; 

const useStyles = makeStyles((theme: Theme) => ({
}));


interface Props extends TableCellProps {
    label?: string;
};

const CustomTableCell: React.FC<Props> = props => {
    const { className, children, label } = props;

    const classes = useStyles();

    return (
        <TableCell
            className={[className].join(' ')}
            aria-label={label}
            role="columnheader"
        >
            {children}
        </TableCell>
    );
};

export default CustomTableCell;