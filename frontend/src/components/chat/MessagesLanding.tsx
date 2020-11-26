import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

interface Props {

}

const MessagesLanding: React.FC<Props> = props => {
    return (
        <Grid style={{height: '100%', padding: '80px 0'}} container alignItems='center'>
            <Grid item xs={12} container alignItems='center' direction='column'>
                <Typography variant='h5' color='textSecondary'>
                    <strong>
                        Inbox
                    </strong>
                </Typography>
                <Typography variant='subtitle2' color='textSecondary'>
                    Select a conversation or start a new one by finding an opponent in matchmaking.
                </Typography>
            </Grid>
        </Grid>
    );
}

export default MessagesLanding;