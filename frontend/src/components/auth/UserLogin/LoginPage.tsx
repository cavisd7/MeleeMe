import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';

import { APIErrorResponse } from 'api/types';
import { UserAuthentication } from 'api/account/types';
import { loginAccountSchema } from 'api/account/schemas';

import { Theme, makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Field } from 'formik';
import Alert from '@material-ui/lab/Alert';

import FormikForm from 'core/formik/FormikForm';
import CustomButton from 'core/CustomButton'
import FormikOutlinedInputWrapper from 'core/formik/FormikOutlinedInputWrapper';

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
    loginUser: (user: UserAuthentication) => Promise<any>;
};

type CombinedProps = Props & RouteComponentProps;

const LoginPage: React.FC<CombinedProps> = props => {
    const { 
        history, 
        accountError, 
        loginUser 
    } = props;

    const [failed, setFailed] = React.useState(false);

    const classes = useStyles();

    const initialValues: UserAuthentication = {
        username: '',
        password: ''
    }

    //TODO: types
    const submit = (values) => {
        loginUser(values)
        .then(_ => {
            history.push('/');
        })
        .catch(_ => { 
            setFailed(true);
        });
    };

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <header className={classes.header}>
                    <Typography variant='h5' align='center'>
                        Account Login
                    </Typography>
                </header>
            </Grid>
            <main className='auth-main'>
                <FormikForm
                    initialValues={initialValues}
                    schema={loginAccountSchema}
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
                        <Grid item xs={12}>
                            <Field
                                fullWidth
                                type='text'
                                name='username'
                                label='Username'
                                component={FormikOutlinedInputWrapper}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                fullWidth
                                type='password'
                                name='password'
                                label='Password'
                                component={FormikOutlinedInputWrapper}
                            />
                        </Grid>
                        <Grid className={classes.submitButton} item container justify='center'>
                            <Grid item>
                                <CustomButton type='submit'>
                                    Log in
                                </CustomButton>
                            </Grid>
                        </Grid>
                        <Grid className={classes.footer} item xs={12} container justify='center'>
                            <Grid item>
                                <Typography variant='caption'>
                                    Don't have an account? <Link to='/auth/register'>Click here</Link> to create one.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </FormikForm>
            </main>
        </React.Fragment>
    );
};

export default LoginPage;