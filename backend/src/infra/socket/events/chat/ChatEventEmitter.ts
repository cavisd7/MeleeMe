import { BaseEmitter } from '../BaseEmitter';
import { ChatService } from '../../../../api/controllers/chat/ChatService';

import { Message } from '../../../../domain/types/message'

type EventType = Record<string, any>;

class ChatEventEmitter<T extends EventType> extends BaseEmitter<T> {
    private service: ChatService;

    constructor (chatService: ChatService) {
        super();

        this.service = chatService;

        this._registerListeners();
    };

    private _registerListeners () {
        this.on('new_message', this._createNewMessageListener());
    }
    
    /**Persist new message */
    public createNewMessage (data: any) {
        this.emit('new_message', data);
    }

    private _createNewMessageListener () {
        return (data: Message) => {
            this.service.createNewMessage(data);
        }
    }
};

export { ChatEventEmitter };