import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom'

import { APIErrorResponse } from 'api/types';
import { RegistrationInput } from 'api/account/types';
import { registerAccountSchema } from 'api/account/schemas';

import { Field, getIn } from 'formik'; 
import { Theme, makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import SlippiIcon from '../../core/SlippiIcon';
import FormikNetcodeOutlinedInputWrapper from '../../core/formik/FormikNetcodeOutlinedInputWrapper';
import FormikOutlinedInputWrapper from 'core/formik/FormikOutlinedInputWrapper';
import FormikForm from 'core/formik/FormikForm';
import CustomButton from 'core/CustomButton';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) => ({
    header: {
        margin: theme.spacing(2, 0)
    },
    formContainer: {
        padding: theme.spacing(2)
    },
    submitButton: {
        marginTop: theme.spacing(3)
    },
    footer: {
        marginTop: theme.spacing(4)
    },
}));

interface Props {
    accountError: APIErrorResponse | null;
    registerUser: (user: RegistrationInput) => Promise<any>;
};

type CombinedProps = Props & RouteComponentProps;

const RegistrationPage: React.FC<CombinedProps> = props => {
    const { 
        history, 
        accountError, 
        registerUser 
    } = props;
    const classes = useStyles();

    const [failed, setFailed] = React.useState(false);

    const initialValues: RegistrationInput = { 
        username: '', 
        password: '', 
        email: '', 
        netcode: '',
        confirmPassword: '' 
    };

    const submit = (values) => {
        values.netcode = values.netcode.toUpperCase() 

        registerUser(values)
        .then(_ => {
            history.push('/');
        })
        .catch(err => { 
            console.log('error', err)
            setFailed(true);
        });
    };

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <header className={classes.header}>
                    <Typography variant='h5' align='center'>
                        Account Registration
                    </Typography>
                </header>
            </Grid>
            <main className='auth-main'>
                <FormikForm
                    initialValues={initialValues}
                    schema={registerAccountSchema}
                    handleSubmit={submit}
                >
                    <Grid className={classes.formContainer} container spacing={2}>
                        { 
                            (!!accountError && failed) && (
                                <Grid item xs={12}>
                                    <Alert severity="error">
                                        {accountError.reason}
                                    </Alert>
                                </Grid>
                            )
                        }
                        <Grid item xs={12} md={8}>
                            <Field 
                                fullWidth
                                type='text'
                                label='Username'
                                name='username'
                                component={FormikOutlinedInputWrapper}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Field 
                                fullWidth
                                type='text'
                                label='Netcode'
                                name='netcode'
                                icon={<SlippiIcon />}
                                component={FormikNetcodeOutlinedInputWrapper}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field 
                                fullWidth
                                type='text'
                                label='Email'
                                name='email'
                                component={FormikOutlinedInputWrapper}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field 
                                fullWidth
                                type='password'
                                label='Password'
                                name='password'
                                component={FormikOutlinedInputWrapper}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field 
                                fullWidth
                                type='password'
                                label='Confirm password'
                                name='confirmPassword'
                                component={FormikOutlinedInputWrapper}
                            />
                        </Grid>
                        <Grid className={classes.submitButton} item container justify='center'>
                            <Grid item>
                                <CustomButton type='submit'>
                                    Register
                                </CustomButton>
                            </Grid>
                        </Grid>
                        <Grid className={classes.footer} item xs={12} container justify='center'>
                            <Grid item>
                                <Typography variant='caption'>
                                    Already have an account? <Link to='/auth/login'>Click here</Link> to login.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </FormikForm>
            </main>
        </React.Fragment>
    );
}

export default RegistrationPage;