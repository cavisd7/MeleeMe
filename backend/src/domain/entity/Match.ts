import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany
} from "typeorm";

import { Message } from './Message';
import { UserMatches } from "./UserMatches";

@Entity("matches")
export class Match {
    @PrimaryGeneratedColumn("uuid") 
    matchId: string;

    @Column()
    isConfirmed: boolean;

    @OneToMany(() => UserMatches, um => um.match)
    playerConnection: UserMatches[];

    @OneToMany(type => Message, message => message.matchId)
    messages: Message[];
};