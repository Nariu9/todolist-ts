import {authAPI, ResultCodes} from '../api/todolists-api';
import {handleServerNetworkError} from '../utils/error-utils';
import {setLoggedInAC} from '../features/Login/auth-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';

//thunk
export const initializeAppTC = createAsyncThunk('app/initialize', async (arg, {dispatch}) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(setLoggedInAC({value: true}))
        } else {
            // ignore auth me server error
            // handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        const error = e as AxiosError
        handleServerNetworkError(error, dispatch)
    }
})

const slice = createSlice({
    name: 'app',
    initialState: {
        colorTheme: 'dark' as ColorThemeType,
        status: 'idle' as RequestStatusType,
        error: null as null | string,
        isInitialized: false
    },
    reducers: {
        changeAppThemeAC(state, action: PayloadAction<{ colorTheme: ColorThemeType }>) {
            state.colorTheme = action.payload.colorTheme === 'light' ? 'dark' : 'light'
        },
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error
        }
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})

export const appReducer = slice.reducer
export const {changeAppThemeAC, setAppStatusAC, setAppErrorAC} = slice.actions

// types
type ColorThemeType = 'dark' | 'light'
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialStateType = ReturnType<typeof slice.getInitialState>