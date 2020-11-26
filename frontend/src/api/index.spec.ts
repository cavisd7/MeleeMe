import { mapErrors } from './index';
import { ValidationError } from 'yup';

describe('mapErrors function', () => {
    it ('should map yup error to account error', () => {
        const dummyYupError/*: Partial<ValidationError>*/ = {
            inner: [
                {
                    errors: ['error one', 'error two'],
                    path: 'username'
                },
                {
                    errors: ['error one'],
                    path: 'password'
                },
            ]
        };

        const accountError = { username: ['error one', 'error two'], password: ['error one'] };

        expect(mapErrors(dummyYupError as ValidationError)).toEqual(accountError);
    });
});