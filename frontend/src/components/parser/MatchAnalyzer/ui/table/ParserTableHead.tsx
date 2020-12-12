import React from 'react';

import { makeStyles, Theme } from '@material-ui/core'; 
import TableRow from '@material-ui/core/TableRow'; 
import TableHead from '@material-ui/core/TableHead'; 
import CustomTableCell from '../../../../core/Table/CustomTableCell';

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        backgroundColor: 'transparent'
    },
    playerCell: {}
}));

interface ParserHeadCellDetails {
    label: string;
    playerName: string;
}

interface Props {
    cells: ParserHeadCellDetails[];
};

const ParserTableWrapper: React.FC<Props> = props => {
    const { cells } = props;

    const classes = useStyles();

    return (
        <TableHead>
            <TableRow>
                <CustomTableCell>
                </CustomTableCell>
                {
                    cells.map((cell, key) => {
                        return (
                            <CustomTableCell
                                className={classes.playerCell}
                                label={cell.label}
                            >
                                {cell.playerName}
                            </CustomTableCell>
                        );
                    })
                }
            </TableRow>
        </TableHead>
    );
};

export default ParserTableWrapper;