import {AppDispatch} from '../app/store';
import {setAppErrorAC, setAppStatusAC} from '../app/app-reducer';
import {ResponseType} from '../api/todolists-api';
import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';

export const handleServerNetworkError = (error: { message: string }, dispatch: AppDispatch | ThunkDispatch<unknown, unknown, AnyAction>) => {
    dispatch(setAppStatusAC({status: 'failed'}))
    dispatch(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
}

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: AppDispatch |  ThunkDispatch<unknown, unknown, AnyAction>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}