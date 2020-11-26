import { object, string, ref } from 'yup';

const netcodeRegex = /(^[A-Za-z]{2,4})[#]([0-9]{3}$)/;

const loginAccountSchema = object().shape({
    username: 
        string()
        .required('Username is required'),
        //.min(5, 'Username must be between 5 and 32 characters')
        //.max(32, 'Username must be between 5 and 32 characters'),
    password: 
        string()
        .required('Password is required')
        //.min(4, 'Password must be at least 8 characters')//TODO: change back to 8
});

const registerAccountSchema = object().shape({
    username: 
        string()
        .required('Username is required')
        .min(5, 'Username must be between 5 and 32 characters')
        .max(32, 'Username must be between 5 and 32 characters'),
    password: 
        string()
        .required('Password is required')
        .min(4, 'Password must be at least 8 characters'),//TODO: change back to 8
    confirmPassword:
        string()
        .required('Must confirm password')
        .oneOf([ref('password')], 'Passwords must match'),
    email: 
        string()
        .email("Must be a valid email")
        .required('Email is required'),
    netcode: 
        string()
        .matches(netcodeRegex, 'Netcode must be formatted like NAME#123')
        .required("Netcode is required")
});

const updateAccountSchema = object().shape({
    username: 
        string()
        .required('Username is required')
        .min(5, 'Username must be between 5 and 32 characters')
        .max(32, 'Username must be between 5 and 32 characters'),
    email: 
        string()
        .email("Must be a valid email")
        .required('Email is required'),
    netcode: 
        string()
        .matches(netcodeRegex, 'Netcode must be formatted like NAME#123')
        .required("Netcode is required"),
    passwordConfirmation: 
        string()
        .required('Password is required')
});

const updatePasswordSchema = object().shape({
    newPassword: 
        string()
        .required('Password is required')
        .min(4, 'Password must be at least 8 characters'),//TODO: change back to 8
    confirmNewPassword: 
        string()
        .required('Must confirm new password')
        .oneOf([ref('newPassword')], 'Passwords must match'),
    passwordConfirmation: 
        string()
        .required('Password is required')
});

const deleteAccountSchema = object().shape({
    passwordConfirmation: 
        string()
        .required('Password is required')
});

export { 
    loginAccountSchema, 
    updateAccountSchema, 
    registerAccountSchema,
    deleteAccountSchema,
    updatePasswordSchema 
}