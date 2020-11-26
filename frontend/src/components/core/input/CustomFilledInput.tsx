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

    componentDidMount() {
        //this.setState({ _error: this.props.error })
    }

    componentDidUpdate() {
        //console.log(this.state);
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { min, max, onChange, defaultErrorMessage } = this.props;
        const { value } = e.target;

        console.log('e', e)
        console.log('props', this.props)

        //this.setState({ value });

        if (onChange) {
            /*if (e.target.value !== value) {
                const clonedE = {
                    ...e,
                    target: e.target.cloneNode()
                } as React.ChangeEvent<HTMLInputElement>;

                clonedE.target.value = value + '';
            } else {
                if (min && e.target.value.length < min) {
                    this.setState({ _error: true, _helperText: defaultErrorMessage });
                } else if (this.state._error && e.target.value.length >= min) {
                    this.setState({ _error: false, _helperText: '' });
                };
            };*/
            onChange(e);
        };
    };

    render() {
        const {
            classes,
            label,
            errorText,
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
                        //fullWidth 
                        //disableUnderline
                        multiline={multiline}
                        {...this.props}
                        value={value}
                        onChange={this.handleChange}
                        //error={(this.state._error)}
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
                        //_helperText
                        helperText
                    }
                </FormHelperText>
            </div>
        );
    };
};

const styled = withStyles(styles)

export default styled(CustomFilledInput);