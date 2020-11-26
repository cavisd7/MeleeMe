import { createThunkRequest } from '../storeHelpers';
import { 
    getUsersMatches as getUsersMatchesAction, 
} from './match.actions';

import { 
    getUsersMatchesRequest, 
} from 'api/matches';

const getUsersMatches = createThunkRequest(getUsersMatchesAction, () => getUsersMatchesRequest());

export { getUsersMatches };