import { createThunkRequest } from '../storeHelpers';
import { 
    getMatchMessages as getMatchMessagesAction, 
} from './chat.actions';

import { 
    getMatchMessagesRequest, 
} from 'api/matches';

const getMatchMessages = createThunkRequest(getMatchMessagesAction, ({ ...data }) => getMatchMessagesRequest(data));

export { getMatchMessages };