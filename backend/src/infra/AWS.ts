import AWS from 'aws-sdk';

import config from './config';
import { ServerLogger } from './utils/logging';

let isAuthenticated = false;
const AWSCredentials = new AWS.SharedIniFileCredentials({ profile: config.aws.credProfile });
let AWSConfig;

if (!AWSCredentials.needsRefresh()) {
    AWSConfig = new AWS.Config({ 
        credentials: AWSCredentials, 
        region: config.aws.region 
    });

    isAuthenticated = true;

    ServerLogger.info(`Using AWS profile: ${(AWSCredentials as any).profile} in region: ${AWSConfig.region}`);
} else {
    ServerLogger.error('AWS credentials not valid');
};

export { AWSCredentials, AWSConfig };


