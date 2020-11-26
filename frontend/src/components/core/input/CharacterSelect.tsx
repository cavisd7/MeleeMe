import React from 'react';

import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import FormControl from "@material-ui/core/FormControl";
import Select, { SelectProps } from '@material-ui/core/Select';
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";

import { playableCharacters, regions } from '../../../utils/characters';
import GenericMenuItem from '../menu/GenericMenuItem';

type Classes =
  | 'paper'
  | 'list' 
  | 'wrapper'
  | 'label'
  | 'select'
  ;

const styles = (theme: Theme) =>
  createStyles({
    paper : {
        maxHeight: '400px',
    },
    list: {
        margin: theme.spacing(0, 1)
    },
    wrapper: {
        display: 'flex',
        width: '100%',
        maxHeight: '56px',
    },
    label: {
        //marginTop: theme.spacing(0.8),
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#555',
        marginTop: theme.spacing(0.8),
        marginBottom: theme.spacing(0.9),
    },
    select: {
        '&:focus': {
            backgroundColor: 'transparent'
        }
    }
  });

interface Props {
    isRegion?: boolean;
    label: string;
    labelId: string;
    name: string;
    defaultValue?: string;
};

interface State {
    value: string;
};

type CombinedProps = Props & SelectProps & WithStyles<Classes>

class CharacterSelect extends React.PureComponent<CombinedProps> {
    render() {
        const { 
            classes,
            isRegion,
            label,
            labelId,
            name,
            defaultValue,
            value,
            ...rest
        } = this.props;

        const characterItems = (
            playableCharacters.map((character) => {
                return (
                    <GenericMenuItem
                        key={character.key}
                        value={character.name}
                    >
                        <Grid container spacing={2} alignItems='center'>
                            <Grid item>
                                <img src={character.icon} />
                            </Grid>
                            <Grid item>
                                {character.name}
                            </Grid>
                        </Grid>
                    </GenericMenuItem>
                )
            })
        );

        const regionItems = (
            regions.map(region => {
                return (
                    <GenericMenuItem
                        key={region.key}
                        value={region.name}
                    >
                        {region.name}
                    </GenericMenuItem>
                )
            })
        );

        return (
            <div>
                <InputLabel
                    className={classes.label} 
                    htmlFor={label}
                >
                    {label}
                </InputLabel>
                <FormControl className={classes.wrapper}>
                    <Select
                        style={{maxHeight: '40px'}}
                        variant='outlined'
                        labelId={labelId} 
                        name={name}
                        defaultValue={defaultValue}
                        value={value}
                        {...rest}
                        MenuProps={{
                            getContentAnchorEl: null,
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "left",
                            },
                            classes: {
                                //select: classes.select,
                                paper: classes.paper,
                                list: classes.list
                            }
                        }}
                        classes={{
                            select: classes.select,
                        }}
                    >
                        { isRegion ? regionItems : characterItems }
                    </Select>
                </FormControl>
            </div>
        );
    }
};

const styled = withStyles(styles);

export default styled(CharacterSelect);
