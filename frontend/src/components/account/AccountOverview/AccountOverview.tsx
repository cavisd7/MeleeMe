import React from 'react';

import { APIErrorResponse } from 'api/types';
import { User } from 'types/user';

import Grid from '@material-ui/core/Grid';

import AccountInfoSection from './ProfileSection';
import DeletionSection from './DeletionSection';
import PasswordSection from './PasswordSection';
import { UpdateAccountParams, DeleteAccountParams, UpdatePasswordParams } from 'api/account/types';
import { RouteComponentProps } from 'react-router-dom';

interface Props {
    user: User;
    accountError: APIErrorResponse | null;
    updateAccount: (user: UpdateAccountParams) => Promise<any>;
    updatePassword: (updatePasswordParams: UpdatePasswordParams) => Promise<any>;
    deleteAccount: (deleteAccountParams: DeleteAccountParams) => Promise<any>;
    updateAvatar: (avatar: string) => void;
};

type CombinedProps = Props & RouteComponentProps;

const AccountOverview: React.FC<CombinedProps> = props => {
    const { 
        history, 
        user, 
        updateAccount,
        deleteAccount,
        updatePassword,
        accountError,
        updateAvatar 
    } = props;

    const [deleteFailed, setDeleteFailed] = React.useState(false);

    const handleDeleteAccount = (deleteAccountParams) => {
        deleteAccount(deleteAccountParams)
        .then(_ => {
            history.push('/');
        })
        .catch(err => { 
            setDeleteFailed(true)
        });
    };

    return (
        <Grid container>
            <Grid item xs={12} style={{marginBottom: '1rem'}}>
                <AccountInfoSection 
                    accountError={accountError}
                    user={user} 
                    updateAccount={updateAccount}
                    updateAvatar={updateAvatar}
                />
            </Grid>
            <Grid item xs={12} style={{marginBottom: '1rem'}}>
                <PasswordSection 
                    accountError={accountError}
                    updatePassword={updatePassword}
                />
            </Grid>
            <Grid item xs={12}>
                <DeletionSection 
                    accountError={accountError}
                    failed={deleteFailed}
                    handleDeleteAccount={handleDeleteAccount}
                />
            </Grid>
        </Grid>
    );
};

export default AccountOverview;