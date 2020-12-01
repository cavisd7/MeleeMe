import fs from 'fs';
import * as uuid from 'uuid';
import winston from 'winston';

import config from '../../config/index';

interface ILogger {
    error: (message: string) => void;
    warn: (message: string) => void;
    info: (message: string) => void;
    debug: (message: string) => void;
};

export class Logger implements ILogger {
    private logger: winston.Logger;
    private name: string;
    private id: string;
    private fileLogError: boolean;

    constructor(name?: string) {
        this.name = name || 'DEFAULT';
        this.id = uuid.v4();
        this.logger = this.init();

        this.fileLogError = false;
    };

    public error (message: string) {
        this.logger.error(`${this.name} - ${message}`);
    };

    public warn (message: string) {
        this.logger.warn(`${this.name} - ${message}`);
    };

    public info (message: string) {
        this.logger.info(`${this.name} - ${message}`);
    };

    public debug (message: string) {
        this.logger.debug(`${this.name} - ${message}`);
    };

    private init(): winston.Logger {
        try {
            if (fs.existsSync(config.combinedLogPath)) {
                fs.unlinkSync(config.combinedLogPath)
            };

            if (fs.existsSync(config.errorLogPath)) {
                fs.unlinkSync(config.errorLogPath)
            };
        } catch (err) {
            this.fileLogError = true;
        };

        const transports = this.makeTransports();

        const myFormat = winston.format.printf(({ message, timestamp }) => {
            return `[${timestamp}] ${message}`;
        })

        return winston.createLogger({
            //level: config.logs.level,
            levels: winston.config.npm.levels,
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                winston.format.errors({ stack: true }),
                myFormat
            ),
            transports
        });
    };

    private makeTransports (): winston.transport[] {
        if (process.env.NODE_ENV !== 'production') {
            return [
                /* TODO: only log certain levels */
                new winston.transports.File({ 
                    filename: config.combinedLogPath,
                    format: winston.format.combine(
                        winston.format.json()
                    ) 
                }),
                new winston.transports.File({ 
                    level: 'error',
                    filename: config.errorLogPath,
                    format: winston.format.combine(
                        winston.format.json()
                    ) 
                }),
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize({ all: true })
                    )
                })
            ];
        } else {
            //AWS Cloudwatch transport
        };
    };
};