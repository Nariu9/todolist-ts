import {authAPI, LoginParamsType, ResultCodes} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../common/utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {todolistsActions} from '../TodolistsList/Todolist';
import {ThunkErrorType} from '../Application/AppTypes';
import {appActions} from '../CommonActions/AppActions';

const {wipeTodolistsData} = todolistsActions
const {setAppStatus} = appActions

// thunk
const login = createAsyncThunk<undefined, LoginParamsType, ThunkErrorType>('auth/login', async (param, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.login(param)
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(setAppStatus({status: 'succeeded'}))
            return
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (e) {
        const error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})

const logout = createAsyncThunk('auth/logout', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(wipeTodolistsData())
            dispatch(setAppStatus({status: 'succeeded'}))
            return
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

export const authAsyncActions = {login, logout}

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder
            .addCase(login.fulfilled, (state) => {
                state.isLoggedIn = true
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = false
            })
    }
})