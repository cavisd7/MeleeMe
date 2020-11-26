interface NotificationItem {
    type: 'request' | 'chat'
    sender: string;
    message: string;
};

export type Notifications = { [name: string]: NotificationItem[] };