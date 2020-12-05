'use strict';

const fs = require('fs');

const dotenv = require('dotenv');

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV)
    throw new Error('NODE_ENV was not set!');

const dotenvFile = `.env.${NODE_ENV}`;

console.log(`Using env file: ${dotenvFile}`);

if (fs.existsSync(dotenvFile)) {
    dotenv.config({ path: dotenvFile });
} else {
    throw new Error('No env file found!');
};

const APP_ENVS = /^APP_/i;
function injectEnvironment() {
    const envs = Object.keys(process.env)
        .filter(key => APP_ENVS.test(key))
        .reduce((base, key) => {
            base[key] = process.env[key];
            return base;
        }, { NODE_ENV: process.env.NODE_ENV || 'development' });
    
    return {
        'process.env': Object.keys(envs).reduce((env, key) => {
          env[key] = JSON.stringify(envs[key]);
          return env;
        }, {})
    };
};

module.exports = injectEnvironment;