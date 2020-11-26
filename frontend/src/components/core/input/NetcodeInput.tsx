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

    const [isHashSet, setIsHashSet] = React.useState(false);
    const [netcode, setNetcode] = React.useState<string>(value as string);

    React.useEffect(() => {
        console.log(props)
    })

    ///(^[A-Z]{4})[#]([0-9]{3}$)/
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            /*if (e.target.value.match(/(^[A-Z]{4})$/i)) {
                if (!isHashSet) {
                    //e.target.value += '#';
                    setNetcode(e.target.value + '#')
                    setIsHashSet(true);
                } 
                //get previous value for edge case
            } else {
                setIsHashSet(false);
                setNetcode(e.target.value.toUpperCase())
            }
    
            if (e.target.value.match(/(^[A-Z]{4})[#]/i)) {
                if (isNaN(Number(e.target.value[e.target.value.length - 1]))) {
    
                }
                console.log('numbers', Number(e.target.value[e.target.value.length - 1]))
            }

            const clonedEvent = {
                ...e,
                target: e.target.cloneNode()
            } as React.ChangeEvent<HTMLInputElement>;
    
            clonedEvent.target.value = netcode;
            onChange(clonedEvent);*/
            onChange(e);
        }
    }

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