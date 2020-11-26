import React from 'react';

import { Theme, makeStyles } from '@material-ui/core';

import CustomOutlinedInput, { Props as OutlinedInputProps } from './CustomOutlinedInput';

const useStyles = makeStyles((theme: Theme) => ({
    input: {
        textTransform: 'uppercase'
    }
}));

export interface Props extends OutlinedInputProps {
    icon: JSX.Element
};

const NetcodeOutlinedInput: React.FC<Props> = (props) => {
    const { icon, label, value, onChange } = props;

    const classes = useStyles();

    ///(^[A-Z]{4})[#]([0-9]{3}$)/
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e);
        }
    }

    return (
        <CustomOutlinedInput
            {...props}
            startAdornment={icon}
            label={label}
            value={value}
            onChange={handleChange}
            classes={{
                inputInput: classes.input
            }}
        />
    );
};

export default NetcodeOutlinedInput;