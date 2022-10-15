import {ResultCodes, TaskType, todolistsAPI} from '../../../../api/todolists-api';
import {RootStateType} from '../../../../app/store';
import {RequestStatusType, setAppStatus} from '../../../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../../../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {todolistsActions} from '../index';
import {appActions} from '../../../../app';


const initialState: TasksStateType = {}

const {addTodolist, fetchTodolists, removeTodolist, wipeTodolistsData} = todolistsActions
// const {setAppStatus} = appActions

// thunk
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistsAPI.getTasks(todolistId)
        dispatch(setAppStatus({status: 'succeeded'}))
        return {todolistId, tasks: res.data.items}
    } catch (e) {
        const error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue({})
    }
})

export const removeTask = createAsyncThunk('tasks/removeTask', async (param: { todolistId: string, taskId: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatus({status: 'loading'}))
    dispatch(changeTaskEntityStatus({...param, status: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTask(param)
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(setAppStatus({status: 'succeeded'}))
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

export const addTask = createAsyncThunk('tasks/addTask', async (param: { todolistId: string, taskTitle: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTask(param)
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(setAppStatus({status: 'succeeded'}))
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

export const updateTasks = createAsyncThunk('tasks/updateTask', async (param: { todolistId: string, taskId: string, model: UpdateDomainTaskModelType }, {
    dispatch,
    rejectWithValue,
    getState
}) => {
    dispatch(setAppStatus({status: 'loading'}))
    dispatch(changeTaskEntityStatus({todolistId: param.todolistId, taskId: param.taskId, status: 'loading'}))

    const state = getState() as RootStateType
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
            dispatch(changeTaskEntityStatus({
                todolistId: param.todolistId,
                taskId: param.taskId,
                status: 'succeeded'
            }))
            dispatch(setAppStatus({status: 'succeeded'}))
            return {todolistId: param.todolistId, taskId: param.taskId, task: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(changeTaskEntityStatus({
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

export const tasksAsyncActions = {fetchTasks, removeTask, addTask, updateTasks}

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        changeTaskEntityStatus: (state, action: PayloadAction<{ todolistId: string, taskId: string, status: RequestStatusType }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], entityStatus: action.payload.status}
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolist.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolist.fulfilled, (state, action) => {
            delete state[action.payload.todolistId]
        })
        builder.addCase(fetchTodolists.fulfilled, (state, action) => {
            action.payload.todolists.forEach((tl) => state[tl.id] = [])
        })
        builder.addCase(wipeTodolistsData, () => {
            return {}
        })
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
        })
        builder.addCase(removeTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        })
        builder.addCase(addTask.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift({...action.payload, entityStatus: 'idle'})
        })
        builder.addCase(updateTasks.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...action.payload.task, entityStatus: 'idle'}
            }
        })
    }
})

export const {changeTaskEntityStatus} = tasksSlice.actions

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