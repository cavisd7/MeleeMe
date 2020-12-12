import { Reducer } from 'redux';

import { Notifications } from 'types/notification';

export interface NotificationsState {
    notifications: Notifications | null;
};

export const notificationsInitialState: NotificationsState = {
    notifications: {
        'hi': [
            {
                type: 'chat',
                sender: 'test',
                message: 'hi'
            },
            {
                type: 'chat',
                sender: 'test',
                message: 'hi'
            },
        ],
        'two': [
            {
                type: 'chat',
                sender: 'test',
                message: 'hi'
            },
            {
                type: 'chat',
                sender: 'test',
                message: 'hi'
            },
        ]
    }   
};

const notifications: Reducer<NotificationsState> = (state: NotificationsState = notificationsInitialState, action) => {
    return state;
};

export default notifications;