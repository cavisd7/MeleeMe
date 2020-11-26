export interface ControllerLogic<Body, Payload> {
    execute (body: Body, userId?: string): Promise<Payload>;
};