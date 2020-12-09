export interface Message {
    avatar?: string;
    matchId: string;
    messageId: string;
    senderId: string;
    sender: string;
    text: string;
    dateSent: Date;
};