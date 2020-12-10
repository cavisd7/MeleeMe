import { BaseController } from "./BaseController";
import { ResourceNotFound } from '../../infra/errors/api/ClientError/ResourceNotFound';

export default class NotFound extends BaseController {
    public async executeImpl (req, res) {
        return this.notFound(res, new ResourceNotFound(`Page ${req.originalUrl} does not exist`));
    };
};