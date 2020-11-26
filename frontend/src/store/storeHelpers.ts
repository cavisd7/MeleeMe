import { AsyncActionCreators } from 'typescript-fsa';

import { ThunkActionCreatorTest } from './types';

export const createThunkRequest = <I, O, E>( 
    action: AsyncActionCreators<I, O, E>, 
    request: (params: I) => Promise<O> 
): ThunkActionCreatorTest<Promise<O>, I> => {
return (params) => 
    async dispatch => {
        dispatch(action.started(params));

        try {
            const result = await request(params);
            dispatch(action.done({ result, params }));
            return result;
        } catch (error) {
            dispatch(action.failed({ error, params }));
            return Promise.reject(error);
        };
    };
};