import winston from 'winston';
import config from '../config/index';
import fs from 'fs';

export default class Logger {
    private logger: winston.Logger;
    private id: string;
    private static instance: Logger;

    //TODO: tag source file
    private constructor () {
        this.logger = this.init();
        this.id = `${Date.now()}`; 
    };

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        };

        return Logger.instance;
    };

    private makeTransports (): any[] {
        let transports: any[] = [
            new winston.transports.File({ filename: config.logOutputPath })
        ];

        const consoleTransport = new winston.transports.Console({
            format: winston.format.combine(
                winston.format.cli(),
                winston.format.splat(),
            )
        });

        if (process.env.NODE_ENV === 'development') transports.push(consoleTransport);

        return transports;
    };

    private init(): winston.Logger {
        try { 
            if (fs.existsSync(config.logOutputPath)) fs.unlinkSync(config.logOutputPath); 
        } catch (err) { 
            /* TODO: handle */
            console.log('Could not remove existing log file.', err);
        };

        const transports = this.makeTransports(); 

        const logger = winston.createLogger({
            level: config.logs.level,
            levels: winston.config.npm.levels,
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.json()
            ),
            transports
        });
        
        return logger;
    };

    public info (message: string) {
        this.logger.info(`[${this.id}] - ${message}`);
    };

    public error (message: string) {
        this.logger.error(`[${this.id}] - ${message}`);
    };

    public log (level: string, message: string) {
        this.logger.log({
            level,
            message,
            meta: {
                loggerId: this.id
            }
        });
    };
};