import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne
} from "typeorm";
import { User } from "./User";
import { Match } from "./Match";

@Entity("messages")
export class Message {
    @PrimaryGeneratedColumn("uuid") 
    messageId: string;

    @ManyToOne(type => Match, match => match.messages)
    matchId: Match;

    @ManyToOne(type => User, user => user.messages)
    senderId: User; 

    /*@Column({ nullable: true })
    avatar: string;*/

    @Column()
    sender: string;

    @Column()
    text: string;

    @Column() 
    dateSent: Date;
};