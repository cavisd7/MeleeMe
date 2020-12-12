import React from 'react';

import { Theme, makeStyles } from '@material-ui/core';

import CustomTableCell from '../../../../core/Table/CustomTableCell';
import CustomTableRow, { OwnProps as CustomTableRowProps } from '../../../../core/Table/CustomTableRow';

const useStyles = makeStyles((theme: Theme) => ({
    statCell: {
        [theme.breakpoints.down('sm')]: {
            width: '50%'
        },
        [theme.breakpoints.up('md')]: {
            width: '40%'
        },
    },
    playerCell: {
        [theme.breakpoints.down('sm')]: {
            width: '25%'
        },
        [theme.breakpoints.up('md')]: {
            width: '30%'
        },
    }
}));

interface Props extends CustomTableRowProps {
    statLabel: string; 
    playerOne: string; 
    playerTwo: string;
}

const ParserTableRow: React.FC<Props> = props => {
    const { 
        statLabel, 
        playerOne, 
        playerTwo, 
        ...rest 
    } = props;

    const classes = useStyles();

    return (
        <React.Fragment>
            <CustomTableRow
                {...rest}
            >
                <CustomTableCell
                    className={classes.statCell}
                >
                    <div>
                        {statLabel}
                    </div>
                </CustomTableCell>
                <CustomTableCell
                    className={classes.playerCell}
                >
                    <div>
                        {playerOne}
                    </div>
                </CustomTableCell>
                <CustomTableCell
                    className={classes.playerCell}
                >
                    <div>
                        {playerTwo}
                    </div>
                </CustomTableCell>
            </CustomTableRow>
        </React.Fragment>
    );
}

export default ParserTableRow;