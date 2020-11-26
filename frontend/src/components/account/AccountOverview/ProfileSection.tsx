import React from 'react';

import { v1Request } from 'api/index';
import { APIErrorResponse } from 'api/types';
import { User } from 'types/user';
import { UpdateAccountParams } from 'api/account/types';
import { updateAccountSchema } from 'api/account/schemas';

import { Field } from 'formik';
import { Theme, makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert'

import SlippiIcon from '../../core/SlippiIcon';
import FormikForm from '../../core/formik/FormikForm';
import FormikOutlinedInputWrapper from '../../core/formik/FormikOutlinedInputWrapper';
import FormikNetcodeOutlinedInputWrapper from '../../core/formik/FormikNetcodeOutlinedInputWrapper';
import CustomButton from '../../core/CustomButton';

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
        //marginLeft: '0.5rem',
        //marginRight: '1.5rem'
    },
    submit: {
        marginTop: '2rem'
    },
    caption: {
        color: 'rgba(0, 0, 0, 0.40) !important'
    }
}));

interface Props {
    user: User; //TODO: trim
    accountError: APIErrorResponse | null;
    updateAccount: (updateAcountParams) => Promise<any>;
    updateAvatar: (avatar: string) => void;
};

const AccountInfoSection: React.FC<Props> = props => {
    const { user, updateAccount, updateAvatar, accountError } = props;

    const profileRef = React.useRef(null);

    const initialValues: UpdateAccountParams = { 
        username: user.username, 
        email: user.email, 
        netcode: user.netcode,
        passwordConfirmation: '', 
    };

    const [isEditing, setIsEditing] = React.useState(false);
    const [validFile, setValidFile] = React.useState<File>();
    const [previewSrc, setPreviewSrc] = React.useState<string>();
    const [avatarError, setAvatarError] = React.useState(false);
    const [failed, setFailed] = React.useState(false);

    const classes = useStyles();

    const submit = (values: UpdateAccountParams, resetForm) => {
        values.netcode = values.netcode.toUpperCase(); 

        updateAccount(values)
            .then(_ => {
                setFailed(false)
                resetForm({
                    values: {
                        username: values.username, 
                        email: values.email, 
                        netcode: values.netcode,
                        passwordConfirmation: '',
                    }
                })
            })
            .catch(err => {
                setFailed(true)
                resetForm();
            });

        setIsEditing(false);
    };

    /*const watchProgress = (event) => {
        console.log(event)
    }*/

    const submitProfilePicture = () => {
        const data = new FormData();
        data.append(`profile`, validFile, validFile.name);

        v1Request(
            { 
                url: '/users/avatar', 
                method: 'put', 
                data,
                //onUploadProgress: (event) => watchProgress(event) 
            }
        ).then(res => {
            console.log(res.data)
            setAvatarError(false)
            setValidFile(null);
            updateAvatar(res.data.avatar)
        })
        .catch(err => {
            console.log(err)
            setAvatarError(true)
        });
    }

    const validateFiles = (files: FileList) => {
        if (files.length === 1 && files[0].size < 10 * 1000000) {
            setValidFile(files[0]);

            let reader = new FileReader();

            reader.onload = (e) => {
                setPreviewSrc((e.target as any).result)
            }

            reader.readAsDataURL(files[0]);
        }
    }

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            console.log(e.target)
            validateFiles(e.target.files);
        };
    }

    const cancelProfilePicture = () => {
        setValidFile(null);
        setPreviewSrc('');
        setAvatarError(false)
    } 

    return (
        <Paper className={classes.paper}>
            <Grid container spacing={5} justify='space-between'>
                <Grid item xs={12} md={4} container direction='column'>
                    <Grid item className={classes.sectionTitle}>
                        <Typography variant='body1'>Profile</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='caption'>
                            Use your slippi netcode that you want to play on.
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item md={7} xs={12} container>
                    <Grid item xs={12} container>
                        {
                            (!!accountError && avatarError) && (
                                <Grid className='space-bottom' item xs={12} md={11}>
                                    <Alert severity="error">
                                        {accountError.reason}
                                    </Alert>
                                </Grid>
                            )
                        }
                        <Grid item className={classes.divider} container>
                            <Grid style={{marginBottom: '0.5rem'}} item xs={12}>
                                <Typography variant='subtitle2'>
                                    <strong>
                                        Profile Picture
                                    </strong>
                                </Typography>
                            </Grid>
                            <Grid style={{ marginBottom: '0.5rem' }} item xs={12} container alignItems='center' justify='space-between'>
                                <Grid item xs={2}>
                                    <Avatar className={classes.icon} alt={user.username} src={previewSrc || user.avatar} />
                                </Grid>
                                <Grid item xs={8} container justify='flex-end'>
                                    <Grid item>
                                        <Button 
                                            style={{marginRight: '1rem'}}
                                            variant='outlined' 
                                            onClick={validFile ? submitProfilePicture : (e) => profileRef.current.click()}
                                        >
                                            {validFile ? 'Submit' : 'Change'}
                                        </Button>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            multiple={false} 
                                            ref={profileRef} 
                                            style={{display: 'none'}} 
                                            name="profilePictureInput" 
                                            onChange={handleProfilePictureChange}
                                        />
                                    </Grid>
                                        {
                                            validFile && ( 
                                                <Grid item>
                                                    <Button variant='outlined' onClick={cancelProfilePicture}>Cancel</Button> 
                                                </Grid>
                                            )
                                        }
                                </Grid>
                            </Grid>
                            {
                                validFile && (
                                    <Grid item xs={10}>
                                        <Typography variant='caption' classes={{ caption: classes.caption }}><strong>File name: </strong>{validFile.name}</Typography>
                                    </Grid>
                                )
                            }
                            {
                                avatarError && (
                                    <Grid item xs={10}>
                                        <Typography color='error' variant='caption'><strong>Failed to upload!</strong></Typography>
                                    </Grid>
                                )
                            }
                        </Grid>
                        <Grid item>
                            {
                                (!!accountError && failed) && (
                                    <Grid className='space-bottom' item xs={12} md={11}>
                                        <Alert severity="error">
                                            {accountError.reason}
                                        </Alert>
                                    </Grid>
                                )
                            }
                            <FormikForm
                                initialValues={initialValues}
                                schema={updateAccountSchema}
                                handleSubmit={submit}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={11}>
                                        <Field
                                            fullWidth
                                            type='text'
                                            name='username'
                                            label='Username'
                                            disabled={!isEditing} 
                                            component={FormikOutlinedInputWrapper}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={11}>
                                        <Field
                                            fullWidth
                                            type='text'
                                            name='netcode'
                                            label='Netcode'
                                            icon={<SlippiIcon />}
                                            disabled={!isEditing} 
                                            component={FormikNetcodeOutlinedInputWrapper}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={11}>
                                        <Field
                                            fullWidth
                                            type='text'
                                            name='email'
                                            label='Email'
                                            disabled={!isEditing} 
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
                                </Grid>
                                <Grid item container justify='flex-end' className={classes.submit}>
                                    <Grid item>
                                        <Button type='submit' variant='outlined' disabled={!isEditing} style={{marginRight: '1rem'}}>Update</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant='outlined' onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</Button>
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

export default AccountInfoSection;