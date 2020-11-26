import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';

//import { } from './notifications.actions';

import { Notifications } from 'types/notification';

export interface NotificationsState {
    notifications: Notifications | null;
};

export const notificationsInitialState: NotificationsState = {
    notifications: {
        'hi': [
            {
                type: 'chat',
                sender: 'atlas',
                message: 'hi'
            },
            {
                type: 'chat',
                sender: 'atlas',
                message: 'hi'
            },
        ],
        'two': [
            {
                type: 'chat',
                sender: 'atlas',
                message: 'hi'
            },
            {
                type: 'chat',
                sender: 'atlas',
                message: 'hi'
            },
        ]
    }   
};

const notifications: Reducer<NotificationsState> = (state: NotificationsState = notificationsInitialState, action) => {
    return state;
};

export default notifications;