import {ResultCodes, todolistsAPI, TodolistType} from '../../api/todolists-api';
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {fetchTasksTC} from './tasks-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';


// thunk
export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists', async (arg, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.getTodolists()
        dispatch(setAppStatusAC({status: 'succeeded'}))
        res.data.forEach((tl) => dispatch(fetchTasksTC(tl.id)))
        return {todolists: res.data}
    } catch (e) {
        const error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({todolistId, entityStatus: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTodolist(todolistId)
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
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

export const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (title: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTodolist(title)
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
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

export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle', async (param: { todolistId: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({todolistId: param.todolistId, entityStatus: 'loading'}))
    try {
        const res = await todolistsAPI.updateTodolist(param)
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(changeTodolistEntityStatusAC({todolistId: param.todolistId, entityStatus: 'succeeded'}))
            return param
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(changeTodolistEntityStatusAC({todolistId: param.todolistId, entityStatus: 'failed'}))
            return rejectWithValue(null)
        }
    } catch (e) {
        const error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

/*export const changeTodolistTitleTC_ = (todolistId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({todolistId, entityStatus: 'loading'}))
    todolistsAPI.updateTodolist({todolistId, title})
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(changeTodolistTitleAC({todolistId, title}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
                dispatch(changeTodolistEntityStatusAC({todolistId, entityStatus: 'idle'}))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeTodolistEntityStatusAC({todolistId, entityStatus: 'failed'}))
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}*/

/*export const addTodolistTC_ = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(addTodolistAC({todolist: res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}*/

/*export const removeTodolistTC_ = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({todolistId, entityStatus: 'loading'}))
    todolistsAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(removeTodolistAC({todolistId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}*/

const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        changeFilterAC: (state, action: PayloadAction<{ todolistId: string, filter: FilterType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.entityStatus
        },
        wipeTodolistsDataAC: (state, action: PayloadAction) => {
            return []
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
        })
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        })
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.title
        })
    }
})

export const todolistsReducer = slice.reducer
export const {
    changeFilterAC,
    changeTodolistEntityStatusAC,
    wipeTodolistsDataAC
} = slice.actions

// types
export type TodolistDomainType = TodolistType & {
    filter: FilterType
    entityStatus: RequestStatusType
}
export type FilterType = 'all' | 'active' | 'completed'