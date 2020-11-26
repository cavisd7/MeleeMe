import React from 'react';

import { deleteAccountSchema } from 'api/account/schemas';
import { DeleteAccountParams } from 'api/account/types';
import { APIErrorResponse } from 'api/types';

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
        paddingTop: '1rem', 
        borderTop: '1px solid rgb(231, 235, 243)'
    },
    icon: {
        width: theme.spacing(8),
        height: theme.spacing(8),
        marginLeft: '0.5rem',
        marginRight: '1.5rem'
    },
    submit: {
        //marginTop: '2rem',
        marginTop: '1rem', 
        maxHeight: '34px'
    }
}));

interface Props {
    failed: boolean;
    accountError: APIErrorResponse | null;
    handleDeleteAccount: (deleteAccountParams) => void;
};

const DeletionSection: React.FC<Props> = (props) => {
    const { handleDeleteAccount, accountError, failed } = props;

    const classes = useStyles();

    const [showConfirm, setShowConfirm] = React.useState(false);

    const initialValues: DeleteAccountParams = { 
        passwordConfirmation: '', 
    };

    const submit = (values: DeleteAccountParams, resetForm) => {
        handleDeleteAccount(values);
        resetForm();
    };

    return (
        <Paper className={classes.paper}>
            <Grid container spacing={5} justify='space-between'>
                <Grid item xs={12} md={4} container direction='column'>
                    <Grid item className={classes.sectionTitle}>
                        <Typography color='primary' variant='body1'>Close Account</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='caption'>
                            <strong>Warning:</strong> This action is irreversible. You will be prompted to confirm your password before proceeding.
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={7} container justify='flex-end' alignItems='center'>
                    <Grid item xs={12} container>
                        {
                            (failed && !!accountError) && (
                                <Grid className='space-bottom' item xs={12} md={11}>
                                    <Alert severity="error">
                                        {accountError.reason}
                                    </Alert>
                                </Grid>
                            )
                        }
                        <Grid item container>
                            <Button color="primary" variant='outlined' onClick={() => setShowConfirm(true)}>Permanently delete account</Button>
                        </Grid>
                        {
                            showConfirm && (
                                <Grid item xs={12} className={classes.hiddenField}>
                                    <FormikForm
                                        initialValues={initialValues}
                                        schema={deleteAccountSchema}
                                        handleSubmit={submit}
                                    >
                                        <Grid container alignItems='center'>
                                            <Grid item xs={7}>
                                                <Field
                                                    fullWidth
                                                    type='password'
                                                    name='passwordConfirmation'
                                                    label='Confirm Password'
                                                    component={FormikOutlinedInputWrapper}
                                                />
                                            </Grid>
                                            <Grid item xs={5} container justify='flex-end' className={classes.submit}>
                                                <Grid item>
                                                    <Button 
                                                        type='submit' 
                                                        color='primary' 
                                                        variant='outlined' 
                                                        disabled={false} 
                                                        style={{marginRight: '1rem'}}
                                                    >
                                                        Delete Account
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button variant='outlined' disabled={false} onClick={() => setShowConfirm(false)}>Cancel</Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </FormikForm>
                                </Grid>
                            )
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default DeletionSection;