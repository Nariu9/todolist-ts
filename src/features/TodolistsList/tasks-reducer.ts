import {addTodolistAC, removeTodolistAC, setTodolistsAC, wipeTodolistsDataAC} from './todolists-reducer';
import {ResultCodes, TaskType, todolistsAPI} from '../../api/todolists-api';
import {AppThunk, RootState} from '../../app/store';
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';


const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTaskAC: (state, action: PayloadAction<{ todolistId: string, taskId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        },
        addTaskAC: (state, action: PayloadAction<{ task: TaskType }>) => {
            state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: 'idle'})
        },
        setTasksAC: (state, action: PayloadAction<{ todolistId: string, tasks: TaskType[] }>) => {
            state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
        },
        updateTaskAC: (state, action: PayloadAction<{ todolistId: string, taskId: string, task: TaskType }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...action.payload.task, entityStatus: 'idle'}
            }
        },
        changeTaskEntityStatusAC: (state, action: PayloadAction<{ todolistId: string, taskId: string, status: RequestStatusType }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], entityStatus: action.payload.status}
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistId]
        })
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach((tl) => state[tl.id] = [])
        })
        builder.addCase(wipeTodolistsDataAC, (state, action) => {
            return {}
        })
    }
})

export const tasksReducer = slice.reducer
export const {removeTaskAC, addTaskAC, setTasksAC, updateTaskAC, changeTaskEntityStatusAC} = slice.actions

// thunk creators
export const fetchTasksTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC({todolistId, tasks: res.data.items}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const addTasksTC = (todolistId: string, taskTitle: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.createTask({todolistId, taskTitle})
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(addTaskAC({task: res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const removeTasksTC = (todolistId: string, taskId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: 'loading'}))
    todolistsAPI.deleteTask({todolistId, taskId})
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(removeTaskAC({todolistId, taskId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const updateTasksTC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType): AppThunk => (dispatch, getState: () => RootState) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: 'loading'}))

    const task = getState().tasks[todolistId].find(t => t.id === taskId)

    if (task) {
        todolistsAPI.updateTask({todolistId, taskId}, {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...model
        })
            .then((res) => {
                if (res.data.resultCode === ResultCodes.successfully) {
                    dispatch(updateTaskAC({todolistId, taskId, task: res.data.data.item}))
                    dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: 'succeeded'}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                    dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: 'failed'}))
                }
            })
            .catch((e) => {
                handleServerNetworkError(e, dispatch)
            })
    }
}

// types
type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}

export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}

export type TasksStateType = {
    [todolistID: string]: TaskDomainType[]
}