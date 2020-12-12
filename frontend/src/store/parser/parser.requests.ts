import { createThunkRequest } from '../storeHelpers';
import { 
    slpMatchUpload as slpMatchUploadAction, 
} from './parser.actions';

const createSlpMatchUpload = (data: any, request: any) => {
    return createThunkRequest(slpMatchUploadAction, () => request(data));
}

export { 
    createSlpMatchUpload
};