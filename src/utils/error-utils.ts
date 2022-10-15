import {AppDispatch} from '../app/store';
import {setAppError, setAppStatus} from '../app/app-reducer';
import {ResponseType} from '../api/todolists-api';
import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
// import {appActions} from '../app';

// const {setAppStatus, setAppError} = appActions

export const handleServerNetworkError = (error: { message: string }, dispatch: AppDispatch | ThunkDispatch<unknown, unknown, AnyAction>) => {
    dispatch(setAppStatus({status: 'failed'}))
    dispatch(setAppError({error: error.message ? error.message : 'Some error occurred'}))
}

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: AppDispatch |  ThunkDispatch<unknown, unknown, AnyAction>) => {
    if (data.messages.length) {
        dispatch(setAppError({error: data.messages[0]}))
    } else {
        dispatch(setAppError({error: 'Some error occurred'}))
    }
    dispatch(setAppStatus({status: 'failed'}))
}