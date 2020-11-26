import React from 'react';

import TextField from '@material-ui/core/TextField'

import { Message } from 'types/message';

type MessageInput = Pick<Message, 'text'>;

interface Props {
    //matchId: string;
    //userId: string;
    //username: string;
    sendMessage: (messageText: string) => void;
};

const ChatInput: React.FC<Props> = (props) => {
    const { sendMessage } = props;

    const [messageText, updateMessageText] = React.useState<string>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateMessageText(e.target.value);
    };

    const handleSubmit = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();

            sendMessage(messageText);
            updateMessageText('');
        };

    };

    return (
        <div style={{ padding: '0.2rem 0.5rem' }}>
            <TextField
                style={{width: '100%'}}
                //error={error}
                //helperText={error ? errorText : ''}
                InputProps={{
                    //disableUnderline: true 
                }}
                inputProps={{ maxLength: 1000 }}
                variant="outlined"
                multiline
                rowsMax={5}
                placeholder="Type Message"
                onChange={handleChange}
                onKeyUp={handleSubmit}
                value={messageText}
                //color='secondary'
            />
        </div>
    );
};

export default ChatInput;