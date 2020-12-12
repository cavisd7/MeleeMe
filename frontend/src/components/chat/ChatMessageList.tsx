import React from 'react';

import { Message } from 'types/message';

import List from '@material-ui/core/List';

import ChatMessageItem from './ChatMessageItem';

interface Props {
    messages: Message[];
};

const ChatMessageList: React.FC<Props> = (props) => {
    const { messages } = props;

    const chatEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

    React.useEffect(() => {
        if (messages.length > 0 && chatEndRef.current) {
            scrollToBottom();
        };
    });

    const showTime = (currSenderId: string, prevSenderId: string, latestDateSent: Date, prevDateSent: Date, index: number): boolean => {
        let prevIndex = index - 1;
        const timeRange = 
            ((latestDateSent.getTime() / 1000 - prevDateSent.getTime() / 1000) <= 60) 
            && (prevDateSent.getTime() / (24 * 60 * 60 * 1000) - latestDateSent.getTime() / (24 * 60 * 60 * 1000) <= 1);

        if (index === 0) {
            return true;
        } else if (currSenderId !== prevSenderId) {
            return true;
        } else if (currSenderId === prevSenderId && timeRange) {
            return false;
        } else {
            return true;
        };   
    };

    return (
        <List style={{ maxWidth: '100%' }}>
            {
                messages.map((message, i) => {
                    const prevIndex = i - 1;
                    let prevMessage = messages[prevIndex];

                    return (
                        <React.Fragment key={message.messageId}>
                            <ChatMessageItem 
                                avatar={message.avatar}
                                messageId={message.messageId}
                                sender={message.sender}
                                text={message.text}
                                date={new Date(message.dateSent)}
                                displayTime={i > 0 ? showTime(message.senderId, prevMessage.senderId, new Date(message.dateSent), new Date(prevMessage.dateSent), i) : true}
                            />
                            <div ref={chatEndRef} />
                        </React.Fragment>
                    );
                })
            }
        </List>
    );
};

export default ChatMessageList;