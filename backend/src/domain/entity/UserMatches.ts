import { 
    Entity, 
    Column, 
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
    BaseEntity
} from "typeorm";

import { Match } from './Match';
import { User } from "./User";

@Entity("user_matches")
export class UserMatches extends BaseEntity {
    @PrimaryColumn()
    playerId: string;

    @PrimaryColumn()
    matchId: string;

    /*@Column
    username: string;

    @Column
    netcode: string;
    */

    @Column()
    isOwner: boolean;

    //match connection
    @ManyToOne(() => User, user => user.matchConnection, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: "playerId" })
    player: User;

    @ManyToOne(() => Match, match => match.playerConnection, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: "matchId" })
    match: Match;
};