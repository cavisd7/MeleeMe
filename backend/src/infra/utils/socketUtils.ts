import { Store } from '../store';
import { ISocketMessage } from '../sockets/types';
import { ServerLogger } from './logging';

export const bundleMessage = (type: string, payload: any): string => {
    return JSON.stringify({ type, payload });
};

export const parseMessage = (data: string): ISocketMessage => {
    let parsedData;

    try {
        parsedData = JSON.parse(data);
    } catch(err) {
        throw new Error('Malformed data, could not parse!');
    };

    return parsedData;
};

export const verifySession = async (req): Promise<string> => {
    /* TODO: Check cookie time */
    const { sessionID } = req;

    const session = await Store.client.get(`sess:${sessionID}`);

    if (!session) {
        throw new Error('No session found');
    };

    let parsedSession;

    try {
        parsedSession = JSON.parse(session);
    } catch (err) {
        throw new Error('Failed to parse session, incorrect formatting');
    };

    return parsedSession;
};