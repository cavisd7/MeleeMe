import express from 'express';
import { pipeline } from 'stream';
import AWS from 'aws-sdk';
import Busboy from 'busboy';

import config from '../../infra/config';
import { ServerLogger } from '../../infra/utils/logging';

export const handleSlpFileUpload = () => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const TARGET_CONTENT_TYPE = /^(multipart\/.+);(.*)$/i;
        
        if (!req.headers['content-length'] || req.headers['content-length'] === '0') {
            ServerLogger.debug('[handleSlpFileUpload] No content');

            return res.status(411).json({ message: 'No content found' });
        };

        if (!TARGET_CONTENT_TYPE.test(req.headers['content-type'])) {
            ServerLogger.debug('[handleSlpFileUpload] No content type');

            return res.status(411).json({ message: 'No content type specified' });
        };

        const s3 = new AWS.S3();
        (req as any).slpPath = [];
        let s3Requests = [];
        const busboy = new Busboy({ headers: req.headers });

        pipeline(req, busboy, (err: NodeJS.ErrnoException) => {
            if (err) {
                ServerLogger.error(`[handleSlpFileUpload] Error in pipeline: ${err}`);

                return res.status(500).json({ message: 'Server missed a ledgedash :(' });
            };
        });

        busboy.on('file', (field, file, name, encoding, mime) => {
            ServerLogger.debug('[busboy onFile]');

            const key = 'tmp-' + new Date().getTime() + name;

            const s3MatchUploadRequest = s3.upload({
                Bucket: config.aws.parserBucket,  
                Key: key,
                Body: file
            })
            .promise();

            file.on('end', () => {
                ServerLogger.debug('[busboy onEnd] Finished reading file');

                s3Requests.push(s3MatchUploadRequest);
            });
        });
        
        busboy.on('finish', async () => {
            await Promise.all(s3Requests)
            .then(values => {
                values.forEach(res => {
                    ServerLogger.debug(`Successfully uploaded slp match ${res.Key} to s3`);

                    (req as any).slpPath.push(res.Key);
                });

                next();
            })
            .catch(err => {
                ServerLogger.error(`Failed to upload slp match to s3: ${err}`);

                return res.status(500).json({ message: 'Failed to upload' });
            });
        });
    };
};