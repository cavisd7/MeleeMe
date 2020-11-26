import { ClientError } from '../errors/ClientError/index';
import { DatabaseError } from '../errors/DatabaseError';
import Logger from '../../infra/utils/Logger';
import { ServerError } from '../errors/ServerError';
import { AuthenticationError } from '../errors/ClientError/AuthenticationError/index';

export abstract class BaseController {
    protected logger: Logger;

    constructor () {
        this.logger = Logger.getInstance();
    };

    //feature's controller logic
    protected abstract executeImpl (req, res): Promise<void | any>;

    //hook up to express router
    public async execute (req, res): Promise<void> {
        try {
            await this.executeImpl(req, res)
        } catch (error) {
            this.logger.error(`Catching in BaseController`);
            this.fail(res)
        };
    };

    protected errorResponse (res, error: any): void {
        switch (Object.getPrototypeOf(error.constructor)) {
            case ClientError:
                return this.clientError(res, error);
            case AuthenticationError:
                return this.authenticationError(res, error);
            case DatabaseError:
                return this.fail(res, error);
            case ServerError:
                return this.fail(res, error);
            default:
                return this.fail(res, error);
        };
    };

    /*protected unchanged<T> (res, dto?: any): void {
        return res.status(304).json(dto);
    }*/

    protected ok<T> (res, dto?: any): void {
        return res.status(200).json(dto);
    };

    protected fail (res, error?: any) {
        return res.status(500).json({ message: 'Server missed a ledgedash :(', error });
    };

    protected notFound (res, error?) {
        return res.status(404).json(error);
    };

    protected authenticationError (res, error) {
        return res.status(401).json({ message: error.message });
    }

    protected clientError (res, error?) {
        return res.status(400).json({ message: error.message });
    };
};