import {AppDispatch} from '../app/store';
import {setAppErrorAC, setAppStatusAC} from '../app/app-reducer';
import {ResponseType} from '../api/todolists-api';
import {put} from 'redux-saga/effects';

export const handleServerNetworkError = (error: { message: string }, dispatch: AppDispatch) => {
    dispatch(setAppStatusAC('failed'))
    dispatch(setAppErrorAC(error.message ? error.message : 'Some error occurred'))
}

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: AppDispatch) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export function* handleServerAppErrorSaga<T>(data: ResponseType<T>) {
    if (data.messages.length) {
        yield put(setAppErrorAC(data.messages[0]))
    } else {
        yield put(setAppErrorAC('Some error occurred'))
    }
    yield put(setAppStatusAC('failed'))
}

export function* handleServerNetworkErrorSaga(error: { message: string }) {
    yield put(setAppStatusAC('failed'))
    yield put(setAppErrorAC(error.message ? error.message : 'Some error occurred'))
}