import React from 'react';

import { FieldProps, getIn } from 'formik';
import CustomFilledInput, { Props as CustomFilledInputProps } from '../input/CustomFilledInput';

interface Props extends CustomFilledInputProps {};

type CombinedProps = Props & FieldProps;

const FormikFilledInputWrapper: React.FC<CombinedProps> = ({form, field, ...props}) => {
    const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name);

    return (
        <CustomFilledInput
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

export default FormikFilledInputWrapper;