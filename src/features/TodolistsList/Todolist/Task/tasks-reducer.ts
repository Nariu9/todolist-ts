import {ResultCodes, TaskType, todolistsAPI} from '../../../../api/todolists-api';
import {RequestStatusType} from '../../../Application/application-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../../../common/utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {RootStateType} from '../../../Application/AppTypes';
import {appActions} from '../../../CommonActions/AppActions';
import {addTodolist, fetchTodolists, removeTodolist, wipeTodolistsData} from '../todolists-reducer';


const initialState: TasksStateType = {}

const {setAppStatus} = appActions

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

const removeTask = createAsyncThunk('tasks/removeTask', async (param: { todolistId: string, taskId: string }, {
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

const addTask = createAsyncThunk('tasks/addTask', async (param: { todolistId: string, taskTitle: string }, {
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

const updateTasks = createAsyncThunk('tasks/updateTask', async (param: { todolistId: string, taskId: string, model: UpdateDomainTaskModelType }, {
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
        builder
            .addCase(addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl) => state[tl.id] = [])
            })
            .addCase(wipeTodolistsData, () => {
                return {}
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index > -1) {
                    tasks.splice(index, 1)
                }
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.todoListId].unshift({...action.payload, entityStatus: 'idle'})
            })
            .addCase(updateTasks.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index > -1) {
                    tasks[index] = {...action.payload.task, entityStatus: 'idle'}
                }
            })
    }
})

const {changeTaskEntityStatus} = tasksSlice.actions

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