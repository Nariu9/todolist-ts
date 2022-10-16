import {tasksAsyncActions, tasksSlice} from './tasks-reducer'

const tasksActions = {
    ...tasksAsyncActions,
    ...tasksSlice.actions
}

const tasksReducer = tasksSlice.reducer

export {tasksActions, tasksReducer}