import {todolistsAsyncActions, todolistsSlice} from './todolists-reducer'

const todolistsActions = {
    ...todolistsAsyncActions,
    ...todolistsSlice.actions
}

const todolistsReducer = todolistsSlice.reducer

export {todolistsActions, todolistsReducer}