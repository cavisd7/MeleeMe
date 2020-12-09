import { MatchmakingSubscriber } from './MatchmakingSubscriber';
import { RoomSubscriber } from './RoomSubscriber';

export class Subscriber {
    public matchmaking;
    public room;

    constructor() {
        this.matchmaking = new MatchmakingSubscriber();
        this.room = new RoomSubscriber();
    };
};