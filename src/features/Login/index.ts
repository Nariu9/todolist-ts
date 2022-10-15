import {authAsyncActions, authSlice} from './auth-reducer';
import {Login} from './Login'

const authActions = {
    ...authAsyncActions,
    ...authSlice.actions
}

const authReducer = authSlice.reducer

export {authActions, authReducer, Login}