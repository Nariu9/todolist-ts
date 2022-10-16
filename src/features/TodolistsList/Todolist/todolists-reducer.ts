import {ResultCodes, todolistsAPI, TodolistType} from '../../../api/todolists-api';
import {RequestStatusType} from '../../Application/application-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../../common/utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {appActions} from '../../CommonActions/AppActions';
import {fetchTasks} from './Task/tasks-reducer';


const {setAppStatus} = appActions

// thunk
export const fetchTodolists = createAsyncThunk('todolists/fetchTodolists', async (arg, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistsAPI.getTodolists()
        dispatch(setAppStatus({status: 'succeeded'}))
        res.data.forEach((tl) => dispatch(fetchTasks(tl.id)))
        return {todolists: res.data}
    } catch (e) {
        const error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

export const removeTodolist = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatus({status: 'loading'}))
    dispatch(changeTodolistEntityStatus({todolistId, entityStatus: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTodolist(todolistId)
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(setAppStatus({status: 'succeeded'}))
            return {todolistId}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        const error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

export const addTodolist = createAsyncThunk('todolists/addTodolist', async (title: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTodolist(title)
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(setAppStatus({status: 'succeeded'}))
            return {todolist: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        const error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

const changeTodolistTitle = createAsyncThunk('todolists/changeTodolistTitle', async (param: { todolistId: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatus({status: 'loading'}))
    dispatch(changeTodolistEntityStatus({todolistId: param.todolistId, entityStatus: 'loading'}))
    try {
        const res = await todolistsAPI.updateTodolist(param)
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(setAppStatus({status: 'succeeded'}))
            dispatch(changeTodolistEntityStatus({todolistId: param.todolistId, entityStatus: 'succeeded'}))
            return param
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(changeTodolistEntityStatus({todolistId: param.todolistId, entityStatus: 'failed'}))
            return rejectWithValue(null)
        }
    } catch (e) {
        const error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

export const todolistsAsyncActions = {fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle}

export const todolistsSlice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        changeFilter: (state, action: PayloadAction<{ todolistId: string, filter: FilterType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.entityStatus
        },
        wipeTodolistsData: (state, action: PayloadAction) => {
            return []
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.todolistId)
                if (index > -1) {
                    state.splice(index, 1)
                }
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.todolistId)
                state[index].title = action.payload.title
            })
    }
})

export const {changeTodolistEntityStatus, wipeTodolistsData} = todolistsSlice.actions

// types
export type TodolistDomainType = TodolistType & {
    filter: FilterType
    entityStatus: RequestStatusType
}
export type FilterType = 'all' | 'active' | 'completed'