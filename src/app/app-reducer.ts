import {AppThunk} from './store';
import {authAPI, ResultCodes} from '../api/todolists-api';
import {handleServerNetworkError} from '../utils/error-utils';
import {setLoggedInAC} from '../features/Login/auth-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
    colorTheme: 'dark' as ColorThemeType,
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        changeAppThemeAC(state, action: PayloadAction<{ colorTheme: ColorThemeType }>) {
            state.colorTheme = action.payload.colorTheme === 'light' ? 'dark' : 'light'
        },
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error
        },
        setAppInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer
export const {changeAppThemeAC, setAppStatusAC, setAppErrorAC, setAppInitializedAC} = slice.actions

//thunk creators
export const initializeAppTC = (): AppThunk => (dispatch) => {
    authAPI.me()
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(setLoggedInAC({value: true}))
            } else {
                // ignore auth me server error
                // handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => {
            dispatch(setAppInitializedAC({isInitialized: true}))
        })
}

// types
type ColorThemeType = 'dark' | 'light'
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialStateType = typeof initialState