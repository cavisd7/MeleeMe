import React from 'react';
import { List, Typography, makeStyles, Theme, Avatar, Button } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(1, 1)
    },
    alert: {
        boxShadow: '0px 5px 5px -1px rgba(0,0,0,0.2), 1px 3px 8px 5px rgba(0,0,0,0.14), 1px 1px 14px 5px rgba(0,0,0,0.12)'
    }
}));

interface Props {
    confirmMatch: () => void;
    denyMatch: () => void;
};

const ConfirmMatchBanner: React.FC<Props> = (props) => {
    const { confirmMatch, denyMatch } = props;

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Alert
                variant="outlined"
                severity="info"
                action={
                    <React.Fragment>
                        <Button color="inherit" size="small" onClick={denyMatch}>
                            Deny
                        </Button>
                        <Button color="inherit" size="small" onClick={confirmMatch}>
                            Confirm
                        </Button>
                    </React.Fragment>
                }
                classes={{
                    root: classes.alert
                }}
            >
                <AlertTitle>Match Confirmation</AlertTitle>
                Would you play like to with this person?
            </Alert>
        </div>
    );
};

export default ConfirmMatchBanner;