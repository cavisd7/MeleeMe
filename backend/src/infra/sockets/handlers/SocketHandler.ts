
/*TODO: type */
export interface SocketHandler {
    exec: (action: string, channel: string, payload: string) => Promise<void>;
    preHandle?: () => void;
};