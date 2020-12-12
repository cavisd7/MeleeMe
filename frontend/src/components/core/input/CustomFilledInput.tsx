import React from 'react';

import { createStyles, Theme, withStyles, WithStyles, InputLabel, FilledInputProps, FilledInput, FormHelperText } from "@material-ui/core";

type Classes =
    | 'root'
    | 'errorStyle'
    | 'label'
    | 'inputInput'
    | 'inputFocused'
    | 'inputDisabled'
    | 'inputUnderline'
    | 'inputRoot'
    | 'inputError' 
    | 'helperTextHidden'
    ;

const styles = (theme: Theme) =>
    createStyles({
        root: {},
        label: {
            marginTop: theme.spacing(0.8),
            marginBottom: theme.spacing(0.3),
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
            borderRadius: 0,
            '& .MuiFilledInput-underline': {
                borderBottomColor: 'blue',
            }
        },
        inputFocused: {
            backgroundColor: '#c5c6c8'
        },
        inputDisabled: {
            backgroundColor: '#f5f9ff !important'
        },
        inputUnderline: {
            '&:before': {},
            '&:after': {
                borderBottom: `2px solid #ee5849 !important`
            }
        },
        inputError: {
            backgroundColor: '#f59b93 !important'
        },
        helperTextHidden: {
            visibility: 'hidden',
        },
    });

export interface Props extends FilledInputProps {
    label?: string;
    errorText?: string;
    defaultErrorMessage?: string;
    helperText?: string;
    min?: number;
    max?: number;
    multiline?: boolean;
};

type CombinedProps = Props & WithStyles<Classes>;

interface State {
    value: string;
    _error: boolean;
    _helperText: string;
};

class CustomFilledInput extends React.PureComponent<CombinedProps, State> {
    state: State = {
        value: '',
        _error: this.props.error || false,
        _helperText: this.props.helperText
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { min, max, onChange } = this.props;
        const { value } = e.target;

        if (onChange) {
            onChange(e);
        };
    };

    render() {
        const {
            classes,
            label,
            value,
            inputProps,
            max,
            multiline,
            error,
            helperText
        } = this.props;

        const { _error, _helperText } = this.state;

        return (
            <div>
                {
                    label && (
                        <InputLabel
                            className={classes.label} 
                            htmlFor={label}
                        >
                            {label}
                        </InputLabel>
                    )
                }
                <div>
                    <FilledInput
                        multiline={multiline}
                        {...this.props}
                        value={value}
                        onChange={this.handleChange}
                        inputProps={{
                            id: label,
                            maxLength: max || 32,
                            ...inputProps
                        }}
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                            focused: classes.inputFocused,
                            disabled: classes.inputDisabled,
                            underline: classes.inputUnderline,
                            error: classes.inputError,
                        }}
                    />
                </div>
                <FormHelperText
                    className={error ? classes.errorStyle : classes.helperTextHidden}
                >
                    {
                        helperText
                    }
                </FormHelperText>
            </div>
        );
    };
};

const styled = withStyles(styles)

export default styled(CustomFilledInput);