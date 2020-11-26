import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn,
    OneToMany,
    BaseEntity
} from "typeorm";

import { UserMatches } from './UserMatches';
import { Message } from './Message';

@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid") 
    userId: string;
  
    @Column("varchar", { length: 32, nullable: true }) 
    username: string;

    @Column("varchar", { length: 100, nullable: true }) 
    password: string;

    @Column("varchar", { length: 100, nullable: true }) 
    email: string;

    @Column("varchar", { length: 10, nullable: true }) 
    netcode: string;

    @Column("varchar", { length: 250, nullable: true }) 
    avatar: string;

    @OneToMany(() => UserMatches, um => um.player, {onDelete:'CASCADE'})
    matchConnection: UserMatches[];
    
    @OneToMany(type => Message, message => message.senderId, {onDelete:'CASCADE'})
    messages: Message[];

    @CreateDateColumn() 
    date_joined: Date;
};