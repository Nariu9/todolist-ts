import {AppThunk} from './store';
import {authAPI, ResultCodes} from '../api/todolists-api';
import {setLoggedInAC} from '../features/Login/auth-reducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {AxiosError} from 'axios';

const initialState = {
    colorTheme: 'dark' as ColorThemeType,
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

export const appReducer = (state: AppInitialStateType = initialState, action: AppActionsType): AppInitialStateType => {
    switch (action.type) {
        case 'APP/CHANGE-COLOR-THEME':
            return {...state, colorTheme: action.colorTheme === 'light' ? 'dark' : 'light'}
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-INITIALIZED':
            return {...state, isInitialized: action.value}
        default :
            return state
    }
}

// action creators
export const changeAppThemeAC = (colorTheme: ColorThemeType) => ({type: 'APP/CHANGE-COLOR-THEME', colorTheme} as const)
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: null | string) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppInitializedAC = (value: boolean) => ({type: 'APP/SET-INITIALIZED', value} as const)

//thunk creators
export const initializeAppTC = (): AppThunk => async (dispatch) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === ResultCodes.successfully) {
            dispatch(setLoggedInAC(true))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e as AxiosError<{ message?: string }>, dispatch)
    } finally {
        dispatch(setAppInitializedAC(true))
    }
}

// types
export type ColorThemeType = 'dark' | 'light'
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialStateType = typeof initialState
export type AppActionsType = ReturnType<typeof changeAppThemeAC>
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>
    | ReturnType<typeof setAppInitializedAC>