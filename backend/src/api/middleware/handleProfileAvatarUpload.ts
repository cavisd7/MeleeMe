import express from 'express';
import { pipeline } from 'stream';
import AWS from 'aws-sdk';
import Busboy from 'busboy';

import config from '../../infra/config';
import { ServerLogger } from '../../infra/utils/logging';

export const handleProfileAvatarUpload = () => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let TARGET_CONTENT_TYPE = /^(multipart\/.+);(.*)$/i;

        if (!req.headers['content-length'] || req.headers['content-length'] === '0') {
            ServerLogger.debug('[handleSlpFileUpload] No content');

            return res.status(411).json({ message: 'No content found' });
        };

        if (!TARGET_CONTENT_TYPE.test(req.headers['content-type'])) {
            ServerLogger.debug('[handleSlpFileUpload] No content type');

            return res.status(411).json({ message: 'No content type specified' });
        };

        const s3 = new AWS.S3();
        const busboy = new Busboy({ headers: req.headers });

        pipeline(req, busboy, (err: NodeJS.ErrnoException) => {
            if (err) {
                ServerLogger.error(`[handleProfileAvatarUpload] Error in pipeline: ${err}`);

                return res.status(500).json({ message: 'Server missed a ledgedash :(' });
            };
        });

        busboy.on('file', (field, file, name, encoding, mime) => {
            ServerLogger.debug('[busboy onFile]');

            s3.upload({
                Bucket: config.aws.profileBucket,  
                Key: new Date().getTime() + name,
                Body: file
            }, (err, file) => {
                if (err) {
                    ServerLogger.error(`Failed to upload slp match to s3: ${err}`);

                    return res.status(500).json({ message: 'Failed to upload' });
                } else {
                    ServerLogger.debug(`Successfully uploaded avatar to s3`);

                    (req as any).profilePicture = file.Location;
                    next();
                };
            });
        });
    };
};