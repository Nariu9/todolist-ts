import {authAPI, ResultCodes} from '../api/todolists-api';
import {handleServerNetworkError} from '../utils/error-utils';
import {setLoggedIn} from '../features/Login/auth-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';

//thunk
export const initializeApp = createAsyncThunk('app/initialize', async (arg, {dispatch}) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(setLoggedIn({value: true}))
        } else {
            // ignore auth me server error
            // handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        const error = e as AxiosError
        handleServerNetworkError(error, dispatch)
    }
})

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        colorTheme: 'dark' as ColorThemeType,
        status: 'idle' as RequestStatusType,
        error: null as null | string,
        isInitialized: false
    },
    reducers: {
        changeAppTheme(state, action: PayloadAction<{ colorTheme: ColorThemeType }>) {
            state.colorTheme = action.payload.colorTheme === 'light' ? 'dark' : 'light'
        },
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppError(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error
        }
    },
    extraReducers: builder => {
        builder.addCase(initializeApp.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})

export const {changeAppTheme, setAppStatus, setAppError} = appSlice.actions

// types
export type ColorThemeType = 'dark' | 'light'
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialStateType = ReturnType<typeof appSlice.getInitialState>