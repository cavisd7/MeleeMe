import accountReducer, { accountInitialState } from './account.reducer';
import { loginUser } from './account.actions';

describe('Account reducer', () => {
    it ('should handle a login request', () => {
        const state = accountReducer(accountInitialState, loginUser.started);
        expect(state).toHaveProperty('loading', true);
    });
});