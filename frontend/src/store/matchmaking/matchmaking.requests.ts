import { createThunkRequest } from '../storeHelpers';
import { getCurrentMatchRequests as getCurrentMatchRequestsAction } from './matchmaking.actions';

import { getCurrentMatchRequestsRequest } from 'api/matchmaking';

const getCurrentMatchRequests = createThunkRequest(getCurrentMatchRequestsAction, () => getCurrentMatchRequestsRequest());

export { getCurrentMatchRequests };