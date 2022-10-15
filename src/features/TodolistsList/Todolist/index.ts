import {todolistsAsyncActions, todolistsSlice} from './todolists-reducer'
import {Todolist} from './Todolist'

const todolistsActions = {
    ...todolistsAsyncActions,
    ...todolistsSlice.actions
}

const todolistsReducer = todolistsSlice.reducer

export {todolistsActions, todolistsReducer, Todolist}