import React from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import List from "@material-ui/core/List"
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import FileItem from './FileItem';

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        padding: theme.spacing(4)
    },
    title: {
        marginBottom: theme.spacing(2)
    },
    center: {
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center'
        }
    },
    item: {
        marginBottom: '2rem', 
        borderBottom: '1px solid rgb(231, 235, 243)', 
        paddingBottom: '1.0rem'
        //padding: theme.spacing(3, 0)
    }
}));

interface Props {
    files: any[];
    submit: (_: React.MouseEvent<HTMLElement>) => void;
    removeFile: (index: number) => void;
    showWaitingMessage: boolean;
};

const FileList: React.FC<Props> = props => {
    const { files, removeFile, submit, showWaitingMessage } = props;

    const classes = useStyles();

    const handleRemoveFile = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, key: number) => {
        removeFile(key);
    }

    return (
        <Paper className={classes.paper}>
            <Grid container>
                <Grid item xs={12} container className={[classes.title, classes.center].join(' ')}>
                    <Typography variant='subtitle1'>
                        <strong>
                            Selected Files
                        </strong>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {
                        files.length > 0 ? (
                            <List>
                                <Grid item xs={12} container>
                                    { 
                                        files.map((file, i) => {
                                            return (
                                                <Grid item xs={12} className={classes.item}>
                                                    <FileItem 
                                                        key={i}
                                                        name={file.name} 
                                                        size={file.size}
                                                        completed={file.completed}
                                                        handleRemoveFile={handleRemoveFile} 
                                                    />
                                                </Grid>
                                            );
                                        })
                                    }
                                </Grid>
                            </List>
                        ) : (
                            <Grid container justify='center' className='space-bottom'>
                                <Typography variant='subtitle2'>No files added.</Typography>
                            </Grid>
                        )
                    }
                </Grid>
                {
                    showWaitingMessage && (
                        <Grid className='space-bottom' item xs={12} container justify='flex-end'>
                            <Typography variant='caption'>Waiting for upload to be completed...</Typography>
                        </Grid>
                    )
                }
                <Grid item xs={12} container justify='flex-end' className={classes.center}>
                    <Button disabled={!(files.length > 0)} variant='outlined' onClick={submit}>Submit</Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default FileList;