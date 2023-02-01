import {authAPI, MeResponseType, ResultCodes} from '../api/todolists-api';
import {call, put, takeEvery} from 'redux-saga/effects';
import {setLoggedInAC} from '../features/Login/auth-reducer';
import {setAppInitializedAC} from './app-reducer';

//action creators for sagas
export const initializeApp = () => ({type: 'APP/INITIALIZE-APP'})

//sagas
export function* initializeAppWorkerSaga() {
    const res: MeResponseType = yield call(authAPI.me)
    if (res.data.resultCode === ResultCodes.successfully) {
        yield put(setLoggedInAC(true))
    } else {

    }
    yield put(setAppInitializedAC(true))
}

export function*  appWatcherSaga () {
    yield takeEvery('APP/INITIALIZE-APP', initializeAppWorkerSaga);
}