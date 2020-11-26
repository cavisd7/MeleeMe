import React from 'react';

import { withStyles, TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';

const StyledTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: 'green',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'green',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'blue',
            },
            '&:hover fieldset': {
                borderColor: 'yellow',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'green',
            },
        },
    },
})(TextField);

interface BaseProps {

};

type CombinedProps = BaseProps & TextFieldProps

const OutlinedTextField: React.StatelessComponent<CombinedProps> = (props) => {
    const { classes, ...rest } = props;

    return (
        <React.Fragment>
            <StyledTextField 
                {...rest}
                fullWidth
                variant="outlined" 
            />
        </React.Fragment>
    );
};

export { OutlinedTextField };
