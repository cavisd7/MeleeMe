import React from 'react';

import TableRow from '@material-ui/core/TableRow';
import CustomTableRow from '../../../core/Table/CustomTableRow';
import { WithStyles, Theme, withStyles, createStyles, Paper, Grid, Collapse, TableCell, Typography, Avatar, Button } from '@material-ui/core';

import RequestTableCell from './RequestTableCell';

import { playableCharacters } from '../../../../utils/characters';

type Classes = 'root' | 'hidden';

const styles = (theme: Theme) =>
  createStyles({
        root: {
            transition: 'border-color 225ms ease-in-out',
            borderLeft: '4px solid transparent',
            '&:before': {
                //paddingLeft: 4
            },
            '&:hover': {
                backgroundColor: 'rgba(245, 0, 87, 0.08) !important',
                borderLeft: '4px solid #ee5849'
            },
        },
        hidden: {
            visibility: 'hidden'
        }
  });

  
interface Props {
    loggedInId: string;
    NON_PRODUCTION_key: number;
    selected: boolean;
    matchId: string;
    userId: string;
    username: string;
    avatar: string;
    netcode: string;
    playingAs: string;
    lookingToPlay: string;
    region: string;
    description: string;
    collapseRow: (key: string) => void;
    selectRequestForNegotiation: (key: number) => void;
};

type CombinedProps = Props & WithStyles<Classes>;
    
const RequestItemRow: React.FC<CombinedProps> = (props) => {
    const { 
        loggedInId,
        NON_PRODUCTION_key,
        classes,
        selected,
        userId,
        username,
        avatar,
        matchId,
        netcode,
        playingAs, 
        lookingToPlay,
        region, 
        description,
        collapseRow,
        selectRequestForNegotiation
    } = props;

    const [showPlay, setShowPlay] = React.useState(false);

    const handleClick = (e: React.MouseEvent<HTMLTableRowElement>, key: string) => {
        collapseRow(key);
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLElement>) => {
        selectRequestForNegotiation(NON_PRODUCTION_key);//TODO: use more unique key
    };

    return (
        <React.Fragment>
            <CustomTableRow
                hover
                key={matchId}
                selected={selected}
                onClick={(e) => handleClick(e, matchId)}
                onMouseOver={() => setShowPlay(true)}
                onMouseOut={() => setShowPlay(false)}
                className={classes.root}
            >   
                <RequestTableCell> 
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{paddingRight: '1rem'}}>
                            <Avatar alt={username} src={avatar} />
                        </div>
                        {username} 
                    </div>
                </RequestTableCell>
                <RequestTableCell> {netcode} </RequestTableCell>
                <RequestTableCell>
                    <Grid container spacing={1} alignItems='center'>
                        <Grid item>
                            <img src={playableCharacters.filter(character => character.name === playingAs)[0].icon} /> {/**TODO: fix */}
                        </Grid>
                        <Grid item>
                            {playingAs} 
                        </Grid>
                    </Grid>
                </RequestTableCell>
                <RequestTableCell> 
                    <Grid container spacing={1} alignItems='center'>
                        <Grid item>
                            <img src={playableCharacters.filter(character => character.name === lookingToPlay)[0].icon} /> {/**TODO: fix */}
                        </Grid>
                        <Grid item>
                            {lookingToPlay} 
                        </Grid>
                    </Grid> 
                </RequestTableCell>
                <RequestTableCell> {region} </RequestTableCell>
                <RequestTableCell>
                    <Button variant='outlined' disabled={userId === loggedInId} className={showPlay ? '' : classes.hidden} onClick={handleButtonClick}>Play</Button>
                </RequestTableCell>
            </CustomTableRow>
            <TableRow>
                <TableCell style={{ padding: 0 }} colSpan={6}>
                    <Collapse in={selected} unmountOnExit>
                        <Grid container spacing={0} style={{padding: 0, backgroundColor: 'rgba(245, 0, 87, 0.08)'}}>
                            <Grid item xs={6} container style={{padding: '1rem'}}>
                                <Grid item xs={12}>
                                    <Typography  style={{ fontWeight: 600 }} variant="subtitle2">Description</Typography>
                                </Grid>
                                <Grid item xs={12} style={{maxWidth: '650px', wordWrap: 'break-word'}}>
                                    <Typography variant="subtitle2">{description}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

const styled = withStyles(styles);

export default styled(RequestItemRow);