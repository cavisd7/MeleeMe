import { PubSub } from '../store';

export const subscribeToChannels = async (channels: string[]) => {
    await PubSub.subscribeToChannels(channels);
};