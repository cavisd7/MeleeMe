import { Request, Response, NextFunction } from 'express';
import Validator from 'validate.js';

import { AppLogger } from '../../infra/utils/logging';
import { NoRequestBodyFound } from '../errors/ClientError/NoRequestBodyFound';
import { ValidationError } from '../errors/ClientError/ValidationError';

export const validate = (schema: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
            AppLogger.error('[validate] No request body found');

            const error = new NoRequestBodyFound().message;

            return res.status(400).json({ error });
        };

        const results = Validator.validate(req.body, schema);
        if (results && Object.keys(results).length !== 0) {
            let errors = [];

            for (const key in results) {
                AppLogger.error(`[validate]: Error during validation: ${results[key]}`);
                errors.push(...results[key]);
            };

            const validationError = new ValidationError(errors);

            return res.status(400).json({ error: validationError });
        };

        AppLogger.info('[validate] Validation complete');

        return next();
    };
};