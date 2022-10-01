import {addTodolistTC, fetchTodolistsTC, removeTodolistTC, wipeTodolistsDataAC} from './todolists-reducer';
import {ResultCodes, TaskType, todolistsAPI} from '../../api/todolists-api';
import {RootState} from '../../app/store';
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';


const initialState: TasksStateType = {}

// thunk
export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.getTasks(todolistId)
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolistId, tasks: res.data.items}
    } catch (e) {
        const error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue({})
    }
})

export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: { todolistId: string, taskId: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTaskEntityStatusAC({...param, status: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTask(param)
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return param
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({})
        }
    } catch (e) {
        const error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue({})
    }
})

export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { todolistId: string, taskTitle: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTask(param)
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return res.data.data.item
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({})
        }
    } catch (e) {
        const error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue({})
    }
})

export const updateTasksTC = createAsyncThunk('tasks/updateTask', async (param: { todolistId: string, taskId: string, model: UpdateDomainTaskModelType }, {
    dispatch,
    rejectWithValue,
    getState
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTaskEntityStatusAC({todolistId: param.todolistId, taskId: param.taskId, status: 'loading'}))

    const state = getState() as RootState
    const task = state.tasks[param.todolistId].find((t: any) => t.id === param.taskId)

    if (!task) {
        return rejectWithValue('task not found in the state')
    }

    try {
        const res = await todolistsAPI.updateTask({todolistId: param.todolistId, taskId: param.taskId}, {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...param.model
        })
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(changeTaskEntityStatusAC({
                todolistId: param.todolistId,
                taskId: param.taskId,
                status: 'succeeded'
            }))
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolistId: param.todolistId, taskId: param.taskId, task: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(changeTaskEntityStatusAC({
                todolistId: param.todolistId,
                taskId: param.taskId,
                status: 'failed'
            }))
            return rejectWithValue({})
        }
    } catch (e) {
        const error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue({})
    }
})

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        changeTaskEntityStatusAC: (state, action: PayloadAction<{ todolistId: string, taskId: string, status: RequestStatusType }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], entityStatus: action.payload.status}
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            delete state[action.payload.todolistId]
        })
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            action.payload.todolists.forEach((tl) => state[tl.id] = [])
        })
        builder.addCase(wipeTodolistsDataAC, (state, action) => {
            return {}
        })
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
        })
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift({...action.payload, entityStatus: 'idle'})
        })
        builder.addCase(updateTasksTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...action.payload.task, entityStatus: 'idle'}
            }
        })
    }
})

export const tasksReducer = slice.reducer
export const {changeTaskEntityStatusAC} = slice.actions

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