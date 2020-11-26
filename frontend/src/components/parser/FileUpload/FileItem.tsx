import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';

interface Props {
    key: number;
    name: string;
    size: number;
    completed: number;
    handleRemoveFile: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, key: number) => void;
};

const FileItem: React.FC<Props> = props => {
    const { key, name, size, completed, handleRemoveFile } = props;

    return (
        <Grid container alignItems='center' spacing={1}>
            <Hidden mdDown>
                <Grid item md={1} container justify='center'>
                    <FileCopyIcon />
                </Grid>
            </Hidden>
            <Grid item xs={9} md={10} container direction='column'>
                <Grid item>
                    <Typography variant='subtitle2'>{name}</Typography>
                </Grid>
                <Grid item>
                    <LinearProgress variant="determinate" value={Math.floor((completed * 100) / size)} />
                </Grid>
                <Grid item>
                    <Typography variant='caption'>{Math.floor((completed * 100) / size)}%</Typography>
                </Grid>
            </Grid>
            <Grid item xs={3} md={1} container justify='center'>
                <IconButton
                    disableFocusRipple
                    disableTouchRipple
                    onClick={(e) => handleRemoveFile(e, key)}
                >
                    <ClearIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
};

export default FileItem;