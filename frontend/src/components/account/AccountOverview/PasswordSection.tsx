import React from 'react';

import { User } from 'types/user';

import { APIErrorResponse } from 'api/types';
import { updatePasswordSchema } from 'api/account/schemas';
import { UpdatePasswordParams } from 'api/account/types';

import { Field } from 'formik';
import { Theme, makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';

import FormikForm from '../../core/formik/FormikForm';
import FormikOutlinedInputWrapper from '../../core/formik/FormikOutlinedInputWrapper';

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        padding: theme.spacing(4)
    },
    sectionTitle: {
        paddingBottom: '4px'
    },
    divider: {
        marginBottom: '1rem', 
        paddingBottom: '1.0rem', 
        borderBottom: '1px solid rgb(231, 235, 243)'
    },
    hiddenField: {
        marginTop: '1rem', 
        borderTop: '1px solid rgb(231, 235, 243)', 
    },
    icon: {
        width: theme.spacing(8),
        height: theme.spacing(8),
        marginLeft: '0.5rem',
        marginRight: '1.5rem'
    },
    submit: {
        marginTop: '2rem'
    }
}));

interface Props {
    accountError: APIErrorResponse | null;
    updatePassword: (updatePasswordParams) => Promise<any>;
}

const PasswordSection: React.FC<Props> = (props) => {
    const { updatePassword, accountError } = props;

    const classes = useStyles();

    //const [showConfirm, setShowConfirm] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [failed, setFailed] = React.useState(false);

    const initialValues: UpdatePasswordParams = {
        newPassword: '',
        confirmNewPassword: '', 
        passwordConfirmation: '', 
    };

    const submit = (values: UpdatePasswordParams, resetForm) => {
        updatePassword(values)
            .then(_ => {
                
            })
            .catch(err => { 
                setFailed(true);
            });
            
        resetForm();
        setIsEditing(false);
    };

    return (
        <Paper className={classes.paper}>
            <Grid container spacing={5} justify='space-between'>
                <Grid item xs={12} md={4} container direction='column'>
                    <Grid item className={classes.sectionTitle}>
                        <Typography variant='body1'>Password</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='caption'>
                            You will be prompted to confirm your current password before changes are submitted.
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={7} container>
                    <Grid item xs={12} container>
                        <Grid xs={12} item>
                            <FormikForm
                                initialValues={initialValues}
                                schema={updatePasswordSchema}
                                handleSubmit={submit}
                            >
                                <Grid container spacing={2}>
                                    { 
                                        (!!accountError && failed) && (
                                            <Grid item xs={12} md={11}>
                                                <Alert severity="error">
                                                    {accountError.reason}
                                                </Alert>
                                            </Grid>
                                        )
                                    }
                                    <Grid item xs={12} md={11}>
                                        <Field
                                            fullWidth
                                            type='password'
                                            name='newPassword'
                                            label='New Password'
                                            component={FormikOutlinedInputWrapper}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={11}>
                                        <Field
                                            fullWidth
                                            type='password'
                                            name='confirmNewPassword'
                                            label='Confirm New Password' 
                                            component={FormikOutlinedInputWrapper}
                                        />
                                    </Grid>
                                    {
                                        isEditing && (
                                            <Grid item xs={12} md={11} className={classes.hiddenField}>
                                                <Field
                                                    fullWidth
                                                    type='password'
                                                    name='passwordConfirmation'
                                                    label='Confirm Password'
                                                    component={FormikOutlinedInputWrapper}
                                                />
                                            </Grid>
                                        )
                                    }
                                    <Grid item container justify='flex-end' className={classes.submit}>
                                        <Grid item>
                                            <Button 
                                                type='submit'
                                                variant='outlined' 
                                                disabled={!isEditing} 
                                                style={{marginRight: '1rem'}}
                                                
                                            >
                                                Update
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button variant='outlined' onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </FormikForm>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default PasswordSection;