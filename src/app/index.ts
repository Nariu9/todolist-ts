import {appSlice} from './app-reducer';

const appActions = {
    ...appSlice.actions
}

const appReducer = appSlice.reducer

export {appActions, appReducer}