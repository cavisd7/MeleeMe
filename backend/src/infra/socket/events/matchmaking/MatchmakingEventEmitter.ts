import { BaseEmitter } from '../BaseEmitter';
import { MatchmakingService } from '../../../../api/controllers/matchmaking/MatchmakingService';

import { MatchRequest, NegotiateMatchRequest } from '../../../../domain/types/match'

type EventType = Record<string, any>;

class MatchmakingEventEmitter<T extends EventType> extends BaseEmitter<T> {
    private service: MatchmakingService;

    constructor (matchMakingService: MatchmakingService) {
        super();

        this.service = matchMakingService;

        this._registerListeners();
    };

    private _registerListeners () {
        this.on('create_new_match', this._createNewMatchListener());
        this.on('create_new_match_request', this._createNewMatchRequestListener());
        this.on('match_confirmed', this._matchConfirmedListener());
        this.on('cleanup_denied_match', this._cleanupDeniedMatchListener());
    }

    /**clean up denied match */
    public cleanupDeniedMatch (data: any) {
        this.emit('cleanup_denied_match', data);
    }

    private _cleanupDeniedMatchListener () {
        return (data: { matchId: string; ownerUserId: string; challengerUserId: string }) => {
            this.service.refreshMatch(data);
        }
    }

    /**Match confirmed */
    public matchConfirmed (data: any) {
        this.emit('match_confirmed', data);
    }

    private _matchConfirmedListener () {
        return (data: string) => {
            this.service.confirmMatch(data);
        }
    }
    
    /**Create New Match */
    public createNewMatch (data: any) {
        this.emit('create_new_match', data);
    }

    private _createNewMatchListener () {
        return (data: NegotiateMatchRequest) => {
            this.service.createNewMatch(data);
        }
    }

    /**Create New Match Request*/
    public createNewMatchRequest (data: any) {
        this.emit('create_new_match', data);
    }

    private _createNewMatchRequestListener () {
        return (data: MatchRequest) => {
            this.service.createNewMatchRequest(data);
        }
    }
};

export { MatchmakingEventEmitter };