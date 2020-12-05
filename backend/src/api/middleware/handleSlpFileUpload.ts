import AWS from 'aws-sdk';
import Busboy from 'busboy';
import { pipeline } from 'stream';

import config from '../../infra/config';

export const handleSlpFileUpload = () => {
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
}