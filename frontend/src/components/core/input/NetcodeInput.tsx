import React from 'react';

import { Theme, makeStyles } from '@material-ui/core';

import CustomFilledInput, { Props as FilledInputProps } from './CustomFilledInput';

const useStyles = makeStyles((theme: Theme) => ({
    input: {
        textTransform: 'uppercase'
    }
}));

export interface Props extends FilledInputProps {
    icon: JSX.Element
};

const NetcodeInput: React.FC<Props> = (props) => {
    const { icon, label, value, onChange } = props;

    const classes = useStyles();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <CustomFilledInput
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

export default NetcodeInput;