import { Request, Response, NextFunction } from 'express';
import Validator, { async } from 'validate.js';

import fs from 'fs';
import path from 'path';
import Busboy from 'busboy';
import { pipeline } from 'stream';
import AWS from 'aws-sdk';

import Logger from '../infra/utils/Logger';
import config from '../infra/config/index';
import { HTTPErrorResponseCode } from './errors/ErrorResponseCodes';
import { NoRequestBodyFound } from './errors/ClientError/NoRequestBodyFound';
import { ValidationError } from './errors/ClientError/ValidationError';
import { NoSessionFound } from './errors/ClientError/AuthenticationError/NoSessionFound';

export default class Middleware {
    private logger: Logger = Logger.getInstance();

    private _error (res: Response, code: HTTPErrorResponseCode, error: any) {
        return res.status(code).json(error);
    };

    public authenticateSession () {
        return (req: Request, res: Response, next: NextFunction) => {
            const sessionCookieName = config.expressConfig.sessionConfig.name;
            
            //TODO: check expiration
            if (!req.cookies[sessionCookieName]) {
                return this._error(res, 401, new NoSessionFound())
            };

            next();
        };
    };

    public validate (schema: any) {
        return (req, res, next) => {
            console.log('validating', req.body)
            if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
                const error = new NoRequestBodyFound();
                return this._error(res, 400, error);
            };

            const results = Validator.validate(req.body, schema);
            if (results && Object.keys(results).length !== 0) {
                let errors = [];

                for (const key in results) {
                    this.logger.error(`[Validation Error]: ${results[key]}`);
                    errors.push(...results[key])
                };

                const validationError = new ValidationError(errors);
                return this._error(res, 400, validationError);
            };

            return next();
        };
    };

    public handleSlpFileUpload () {
        return (req, res, next) => {
            let completed = false;
            let TARGET_CONTENT_TYPE = /^(multipart\/.+);(.*)$/i;
            const s3 = new AWS.S3();
            req.slpPath = [];

            if ((!req.headers['content-length'] || req.headers['content-length'] === '0' || !req.headers['transfer-encoding']) && !completed) {
                console.log('no content loength');
                //this._error(res, 411, new Error('No content found.')); //TODO: check code
            };

            if (!TARGET_CONTENT_TYPE.test(req.headers['content-length']) && !completed) {
                console.log('no content something');
                //this._error(res, 411, new Error('No content length.'));
            };

            const busboy = new Busboy({ headers: req.headers });

            pipeline(req, busboy, (err) => {
                console.log('Error in pipeline, destroying...');
                //this._error(res, 500, new Error('Error in pipeline.'));
                //next(new Error(err.toString()));
            });

            let s3Requests = [];

            busboy.on('file', (field, file, name, encoding, mime) => {
                const key = 'tmp-' + new Date().getTime() + name

                const s3MatchUploadRequest = s3.upload({
                    Bucket: config.aws.parserBucket,  
                    Key: key,
                    Body: file
                })
                .promise()

                file.on('end', () => {
                    console.log('File has finished writing');
                    s3Requests.push(s3MatchUploadRequest);
                })
            });
            
            busboy.on('error', (err) => {
                console.log('busboy error');
                //next(err);
                //this._error(res, 500, new Error('Busboy error.'));
            });
            
            busboy.on('finish', async () => {
                await Promise.all(s3Requests)
                .then(values => {
                    console.log('then', values)
                    values.forEach(res => {
                        console.log('s3 url: ', res.Key);
                        req.slpPath.push(res.Key)
                    })

                    completed = true;
                    next();
                })
                .catch(err => {
                    console.log('Failed to upload key:')
                    res.status(500).json({ message: 'Failed to upload' })
                })

            })
        };
    };

    public handleProfilePictureUpload () {
        return (req: Request, res, next) => {
            const s3 = new AWS.S3(/*{ params: { Bucket: config.aws.profileBucket } }*/);

            let completed = false;
            let TARGET_CONTENT_TYPE = /^(multipart\/.+);(.*)$/i;

            if ((!req.headers['content-length'] || req.headers['content-length'] === '0' || !req.headers['transfer-encoding']) && !completed) {
                console.log('no content loength');
                //next();
                //return res.status(411).json({ message: 'No content found.' });
                //this._error(res, 411, new Error('No content found.')); //TODO: check code
            };

            if (!TARGET_CONTENT_TYPE.test(req.headers['content-length']) && !completed) {
                console.log('no content something');
                //next();
                //this._error(res, 411, new Error('No content length.'));
            };

            const busboy = new Busboy({ headers: req.headers });

            pipeline(req, busboy, (err) => {
                console.log('Error in pipeline, destroying...');
                //this._error(res, 500, new Error('Error in pipeline.'));
                //next(new Error(err.toString()));
            });

            busboy.on('file', (field, file, name, encoding, mime) => {
                const filename = path.parse(name).name;

                console.log(encoding, name, field)
                //file.on('data', (data) => console.log('data', data));

                s3.upload({
                    Bucket: config.aws.profileBucket,  
                    Key: new Date().getTime() + name,
                    Body: file
                }, (err, file) => {
                    if (err) {
                        console.log('failed to upload to s3', err)
                        //this._error(res, 500, {message: 'Failed to upload'})
                    } else {
                        console.log(file);
                        (req as any).profilePicture = file.Location;
                        next();
                    }
                })
            });

            busboy.on('finish', () => {
                console.log('busboy finish')
                completed = true;
                //next();
            })
            
            busboy.on('error', (err) => {
                console.log('busboy error');
                //next(err);
                //this._error(res, 500, new Error('Busboy error.'));
            });
            
            /*busboy.on('finish', () => {
                completed = true;
                next();
            })*/
        };
    };
};