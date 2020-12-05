import { SocketHandler } from './SocketHandler';

import { Store, PubSub } from '../../store';

export default class MatchmakingHandler implements SocketHandler {
    constructor() {};

    public async exec(action: string, channel: string, payload: string): Promise<void> {
        switch(action) {
            /*TODO: type cases */
            case 'create-match-request':
                return await this.CreateMatchRequest(channel, payload);
            default:
                throw new Error('Unrecognized action in MatchmakingHandler');
        };
    };

    private async CreateMatchRequest(channel: string, payload: any): Promise<void> {
        await PubSub.publishToChannel(channel, payload);
    };
};