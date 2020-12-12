import React from 'react';

import { Theme, makeStyles, InputBase, IconButton } from '@material-ui/core';
import Paper from '@material-ui/core/Paper'
import SearchIcon from '@material-ui/icons/Search';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        height: '30px',
        boxShadow: 'none',
        border: '1px solid #e6dfdf'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        paddingTop: '5px'
    },
    iconButton: {
        height: '30px',
        width: '30px',
    }
}));

interface Props {
    placeholder?: string
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ChatSearchInput: React.FC<Props> = (props) => {
    const { placeholder, handleChange } = props;

    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <InputBase
                className={classes.input}
                placeholder={placeholder}
                onChange={handleChange}
            />
            <IconButton className={classes.iconButton}>
                <SearchIcon/>
            </IconButton>
        </Paper>
    );
};

export default ChatSearchInput;