import React from 'react';

import { FieldProps, getIn } from 'formik';
import NetcodeOutlinedInput, { Props as NetcodeOutlinedInputProps } from '../input/NetcodeOutlinedInput';

interface Props extends NetcodeOutlinedInputProps {};

type CombinedProps = Props & FieldProps;

const FormikNetcodeOutlinedInputWrapper: React.FC<CombinedProps> = ({form, field, ...props}) => {
    const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name);

    return (
        <NetcodeOutlinedInput
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

export default FormikNetcodeOutlinedInputWrapper;