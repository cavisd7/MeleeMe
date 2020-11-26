import React from 'react';

import { FieldProps, getIn } from 'formik';
import CustomOutlinedInput, { Props as CustomOutlinedInputProps } from '../input/CustomOutlinedInput';

interface Props extends CustomOutlinedInputProps {};

type CombinedProps = Props & FieldProps;

const FormikOutlinedInputWrapper: React.FC<CombinedProps> = ({form, field, ...props}) => {
    const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name);

    return (
        <CustomOutlinedInput
            {...props}
            helperText={errorText}
            name={field.name}
            value={field.value}
            error={!!errorText}
            onChange={field.onChange}
            onBlur={field.onBlur}
        />
    )   
};

export default FormikOutlinedInputWrapper;