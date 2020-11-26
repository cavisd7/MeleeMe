import { createThunkRequest } from '../storeHelpers';
import { 
    slpMatchUpload as slpMatchUploadAction, 
} from './parser.actions';

import { 
    slpMatchUploadRequest,  
} from 'api/parser';

//const slpMatchUpload = createThunkRequest(slpMatchUploadAction, ({ ...data }) => slpMatchUploadRequest(data));

const createSlpMatchUpload = (data: any, request: any) => {
    return createThunkRequest(slpMatchUploadAction, () => request(data));
}

export { 
    //slpMatchUpload,
    createSlpMatchUpload
};