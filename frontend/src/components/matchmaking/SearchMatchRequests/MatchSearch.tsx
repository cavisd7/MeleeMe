import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import CharacterSelect from '../../core/input/CharacterSelect';

import { MatchFilter } from 'types/match';

interface Props {
    filter: MatchFilter;
    searchMatchRequests: (filter: MatchFilter) => void;
};

const MatchSearch: React.FC<Props> = (props) => {
    const { searchMatchRequests, filter } = props;

    //const [state, setState] = React.useState<MatchFilter>(filter);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setState({ ...state, [e.target.name]: e.target.value });
        searchMatchRequests({ ...filter, [e.target.name]: e.target.value });
    };

    React.useEffect(() => {
        //setState(filter);
        console.log('filter', filter)
    }, [filter])

    return (
        <Grid className='space-bottom' container spacing={4} justify='center' direction='row' alignItems='center'>
            <Grid item xs={12} md={3}>
                <CharacterSelect
                    label='Playing as'
                    labelId="playing-as-label"
                    name="playingAs"
                    defaultValue="Any"
                    value={filter.playingAs}
                    onChange={handleSelect}
                />
            </Grid>
            <Grid item md={1} xs={12} container justify='center'>
                <Typography variant='h5'>Vs</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
                <CharacterSelect
                    label='Looking to play'
                    labelId="looking-to-play-label"
                    name="lookingToPlay"
                    value={filter.lookingToPlay}
                    onChange={handleSelect}
                />
            </Grid>
            <Grid item xs={12} md={2}>
                <CharacterSelect
                    isRegion
                    label='Region'
                    labelId="region-label"
                    name="region"
                    value={filter.region}
                    onChange={handleSelect}
                />
            </Grid>
        </Grid>
    );
};

export default MatchSearch;