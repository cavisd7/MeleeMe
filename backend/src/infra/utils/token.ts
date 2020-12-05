import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import config from '../config';

const createToken = (payload: object, expiresIn?: number): string => {
    return jwt.sign(
        payload, 
        config.jwtSecret, 
        {
            expiresIn: expiresIn || 1000 * 60 * 60 * 24 * 10, //default 10 days
            issuer: 'melee.me'
        }
    );
};

const verifyToken = (token: string): Promise<object> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err) {
                return reject();
            };

            return resolve(decoded);
        });
    });
};

export { createToken, verifyToken };