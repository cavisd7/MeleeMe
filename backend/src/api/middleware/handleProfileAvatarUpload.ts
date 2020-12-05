import { Request, Response, NextFunction } from 'express';
import AWS from 'aws-sdk';
import Busboy from 'busboy';
import { pipeline } from 'stream';

import config from '../../infra/config';

export const handleProfileAvatarUpload = () => {
    return (req: Request, res: Response, next: NextFunction) => {
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
}