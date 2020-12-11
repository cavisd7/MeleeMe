import { ClientError } from '../../infra/errors/api/ClientError/index';
import { DatabaseError } from '../../infra/errors/api/DatabaseError';
import { ServerLogger } from '../../infra/utils/logging';
import { ServerError } from '../../infra/errors/api/ServerError';
import { AuthenticationError } from '../../infra/errors/api/ClientError/AuthenticationError/index';

export abstract class BaseController {
    protected abstract executeImpl (req, res): Promise<void | any>;

    public async execute (req, res): Promise<void> {
        try {
            await this.executeImpl(req, res);
        } catch (error) {
            ServerLogger.error(`Catching in BaseController`);
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

    protected ok<T> (res, dto?: any): void {
        return res.status(200).json(dto);
    };

    protected fail (res, error?: any): void {
        return res.status(500).json({ message: 'Server missed a ledgedash :(', error });
    };

    protected notFound (res, error?): void {
        return res.status(404).json(error);
    };

    protected authenticationError (res, error): void {
        return res.status(401).json({ message: error.message });
    }

    protected clientError (res, error?) {
        return res.status(400).json({ message: error.message });
    };
};