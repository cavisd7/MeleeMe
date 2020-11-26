import React from 'react';

import { createStyles, Theme, withStyles, WithStyles, InputLabel, InputBaseProps, InputBase, TextField, OutlinedTextFieldProps, FormHelperText } from "@material-ui/core";

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
            marginBottom: theme.spacing(0.9),
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

export interface Props extends OutlinedTextFieldProps {
    label?: string;
    errorText?: string;
    defaultErrorMessage?: string;
    helperText?: string;
    min?: number;
    max?: number;
    multiline?: boolean;
    startAdornment?: JSX.Element; 
};

type CombinedProps = Props & WithStyles<Classes>;

class CustomOutlinedInput extends React.PureComponent<CombinedProps, {}> {
    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { onChange } = this.props;

        if (onChange) {
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
            helperText,
            startAdornment,
            variant,
            ...rest
        } = this.props;

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
                    <TextField
                        variant='outlined'
                        multiline={multiline}
                        {...rest}
                        value={value}
                        onChange={this.handleChange}
                        InputProps={{
                            startAdornment: startAdornment
                        }}
                        inputProps={{
                            id: label,
                            maxLength: max || 32,
                            ...inputProps,
                            className: classes.inputInput
                        }}
                        classes={{
                            
                            //root: classes.inputRoot,
                            //input: classes.inputInput,
                            //focused: classes.inputFocused,
                            //disabled: classes.inputDisabled,
                            //error: classes.inputError,
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

export default styled(CustomOutlinedInput);