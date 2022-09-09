import {AppThunk} from '../../app/store';
import {authAPI, LoginParamsType, ResultCodes} from '../../api/todolists-api';
import {setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {wipeTodolistsDataAC} from '../TodolistsList/todolists-reducer';

const initialState = {
    isLoggedIn: false
}

export const authReducer = (state: LoginInitialStateType = initialState, action: LoginActionTypes): LoginInitialStateType => {
    switch (action.type) {
        case 'LOGIN/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

// action creators
export const setLoggedInAC = (value: boolean) => ({type: 'LOGIN/SET-IS-LOGGED-IN', value} as const)

// thunk creators
export const loginTC = (data: LoginParamsType): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(setLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const logoutTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then((res) => {
            if (res.data.resultCode === ResultCodes.successfully) {
                dispatch(setLoggedInAC(false))
                dispatch(wipeTodolistsDataAC())
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}

// types
export type LoginInitialStateType = typeof initialState
type LoginActionTypes = ReturnType<typeof setLoggedInAC>

