import React from 'react';

import { FieldProps, getIn } from 'formik';
import NetcodeInput, { Props as NetcodeInputProps } from '../input/NetcodeInput';

interface Props extends NetcodeInputProps {};

type CombinedProps = Props & FieldProps;

const FormikNetcodeInputWrapper: React.FC<CombinedProps> = ({form, field, ...props}) => {
    const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name);

    return (
        <NetcodeInput
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

export default FormikNetcodeInputWrapper;