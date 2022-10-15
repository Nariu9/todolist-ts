import {tasksAsyncActions, tasksSlice} from './tasks-reducer'
import {Task} from './Task'

const tasksActions = {
    ...tasksAsyncActions,
    ...tasksSlice.actions
}

const tasksReducer = tasksSlice.reducer

export {tasksActions, tasksReducer, Task}