import React from 'react';

import { 
    createStyles, 
    Theme, 
    withStyles, 
    WithStyles, 
    InputLabel,
    FilledInputProps, 
    FilledInput, 
    FormHelperText, 
    InputAdornment, 
    Grid 
} from "@material-ui/core";

type Classes =
    | 'root'
    | 'errorStyle'
    | 'label'
    | 'inputInput'
    | 'inputFocused'
    | 'inputDisabled'
    | 'inputUnderline'
    | 'inputRoot';

const styles = (theme: Theme) =>
    createStyles({
        root: {},
        label: {
            marginTop: theme.spacing(0.8),
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#555'
        },
        errorStyle: {
            color: 'red',
        },
        inputInput: {
            minHeight: '30px',
            padding: theme.spacing(1, 1, 0, 1)
        },
        inputRoot: {
            '& .MuiFilledInput-underline': {
                borderBottomColor: 'blue',
            }
        },
        inputFocused: {
            backgroundColor: '#c5c6c8'
        },
        inputDisabled: {
            backgroundColor: '#f5f9ff'
        },
        inputUnderline: {
            '&:before': {},
            '&:after': {
                borderBottom: `2px solid ${theme.palette.primary.main} !important`
            }
        }
    });

interface Props extends FilledInputProps {
    label?: string;
    errorText?: string;
    min?: number;
    max?: number;
};

type CombinedProps = Props & WithStyles<Classes>;

interface State {
    value: string;
};

class NetcodeInput extends React.PureComponent<CombinedProps, State> {
    state: State = {
        value: ''
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { min, max, onChange } = this.props;
        const { value } = e.target;

        let updatedValue;

        if (min && max) {
            updatedValue = +value < min ? min : +value > max ? max : value;
        } else {
            updatedValue = value;
        };

        this.setState({ value: updatedValue });

        if (onChange) {
            if (e.target.value !== updatedValue) {
                const clonedE = {
                    ...e,
                    target: e.target.cloneNode()
                } as React.ChangeEvent<HTMLInputElement>;

                clonedE.target.value = updatedValue + '';
            } else {
                onChange(e);
            };
        };
    };

    render() {
        const {
            classes,
            label,
            errorText,
            value,
            inputProps
        } = this.props;

        return (
            <div>
                {
                    label && (<InputLabel
                        className={classes.label} 
                        htmlFor={label}
                    >
                        {label}
                    </InputLabel>)
                }
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <FilledInput
                            {...this.props}
                            value={value}
                            onChange={this.handleChange}
                            error={!!errorText}
                            inputProps={{
                                ...inputProps
                            }}
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                                focused: classes.inputFocused,
                                disabled: classes.inputDisabled,
                                underline: classes.inputUnderline
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FilledInput
                            {...this.props}
                            value={value}
                            onChange={this.handleChange}
                            error={!!errorText}
                            startAdornment={<InputAdornment position="start">#</InputAdornment>}
                            inputProps={{
                                ...inputProps
                            }}
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                                focused: classes.inputFocused,
                                disabled: classes.inputDisabled,
                                underline: classes.inputUnderline
                            }}
                        />
                    </Grid>
                </Grid>
                {errorText && (
                    <FormHelperText
                        className={classes.errorStyle}
                    >
                        {errorText}
                    </FormHelperText>)
                }
            </div>
        );
    };
};

const styled = withStyles(styles)

export default styled(NetcodeInput);