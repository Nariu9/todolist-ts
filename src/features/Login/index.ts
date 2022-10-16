import {authAsyncActions, authSlice} from './auth-reducer';

const authActions = {
    ...authAsyncActions,
    ...authSlice.actions
}

const authReducer = authSlice.reducer

export {authActions, authReducer}