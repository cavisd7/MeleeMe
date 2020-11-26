import React from 'react';

import { MatchRequest, MatchRequestInput } from 'types/match';

import { makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import OutlinedInput from '../../core/input/CustomOutlinedInput';
import CharacterSelect from '../../core/input/CharacterSelect';

const useStyles = makeStyles((theme: Theme) => ({
    center: {
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center'
        }
    },
}));

interface Props {
    username: string;
    netcode: string;
    createMatchRequest: (request: MatchRequestInput) => void;
};

const CreateMatchRequest: React.FC<Props> = (props) => {
    const { 
        username, 
        netcode, 
        createMatchRequest 
    } = props;

    const classes = useStyles();

    const [request, setRequest] = React.useState<MatchRequestInput>({ playingAs: 'Any', lookingToPlay: 'Any', region: 'Any', description: '' });

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRequest({ ...request, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        createMatchRequest(request);
    };

    return (
        <Paper style={{ padding: '2rem 3rem' }}>
            <Grid container>
                <Grid className={['space-bottom', classes.center].join(' ')} item container>
                    <Typography style={{  color: '#32363c', fontWeight: 600 }} variant='h6'>New Request</Typography>
                </Grid>
                <Grid style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgb(231, 235, 243)' }} item container justify='space-between'>
                    <Grid style={{ marginBottom: '1rem' }} item md={4} xs={12} container direction='column'>
                        <Grid item>
                            <Typography variant='body1'>User Details</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='caption'>
                                This information will be displayed on your match request.
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item md={7} xs={12} container direction='column' spacing={2}> 
                        <Grid item xs={12}>
                            <OutlinedInput 
                                variant='outlined'
                                fullWidth
                                name="username"
                                label='Username' 
                                disabled={true} 
                                value={username}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <OutlinedInput 
                                variant='outlined'
                                fullWidth
                                name="netcode"
                                label='Netcode' 
                                disabled={true} 
                                value={netcode}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgb(231, 235, 243)' }} item container justify='space-between'>
                    <Grid style={{ marginBottom: '1rem' }} item md={4} xs={12} container direction='column'>
                        <Grid item>
                            <Typography variant='body1'>Matchup Selection</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='caption'>
                                Pick a matchup you would like to play. Select a region that is closest to you for best latency.
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item md={7} xs={12} container spacing={2}>
                        <Grid item container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <CharacterSelect
                                    label='Playing as'
                                    labelId="playing-as-label"
                                    name="playingAs"
                                    defaultValue="Any"
                                    value={request.playingAs}
                                    onChange={handleSelect}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CharacterSelect
                                    label='Looking to play'
                                    labelId="looking-to-play-label"
                                    name="lookingToPlay"
                                    value={request.lookingToPlay}
                                    onChange={handleSelect}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CharacterSelect
                                isRegion
                                label='Region'
                                labelId="region-label"
                                name="region"
                                value={request.region}
                                onChange={handleSelect}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid style={{ marginBottom: '1rem', paddingBottom: '1rem' }} item container justify='space-between'>
                    <Grid style={{ marginBottom: '1rem' }} item md={4} xs={12} container direction='column'>
                        <Grid item>
                            <Typography variant='body1'>Additional Info (optional)</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='caption'>
                                Enter any other information that you would like potential playmates to know.
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid style={{ marginBottom: '1rem' }} item xs={12} md={7}>
                        <OutlinedInput 
                            variant='outlined'
                            fullWidth
                            multiline
                            max={180}
                            name="description"
                            label='Description' 
                            value={request.description}
                            onChange={handleSelect}
                        />
                        <Typography variant='subtitle2'>{request.description.length} / 180</Typography>
                    </Grid>
                </Grid>
                <Grid className={classes.center} item xs={12} container justify='flex-end'>
                    <Button variant='outlined' onClick={handleSubmit}>Submit</Button>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default CreateMatchRequest;