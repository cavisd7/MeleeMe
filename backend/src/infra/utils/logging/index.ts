import { Logger } from './Logger';

const ServerLogger = new Logger('Server');
const AppLogger = new Logger('App');

export { ServerLogger, AppLogger };