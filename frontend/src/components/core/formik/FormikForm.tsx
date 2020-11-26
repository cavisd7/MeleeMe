import React from 'react';

import { Formik, Form, FormikState } from 'formik';
import { ObjectSchema } from 'yup';

interface Props {
    initialValues: any;
    schema?: ObjectSchema<any>;
    handleSubmit: (values: any, resetForm: (nextState?: Partial<FormikState<any>>) => void) => any;
};

type CombinedProps = React.PropsWithChildren<Props> & Props & React.HTMLAttributes<HTMLFormElement>;

const FormikForm: React.FC<CombinedProps> = props => {
    const { children, className } = props;

    return (
        <Formik 
            validateOnChange
            //enableReinitialize
            //className={className}
            validationSchema={props.schema}
            initialValues={props.initialValues}
            onSubmit={(values, { resetForm }) => props.handleSubmit(values, resetForm)}
        >
            {
                () => (
                    <Form>
                        {children}
                    </Form>
                )
            }
        </Formik>
    );
};

export default FormikForm;