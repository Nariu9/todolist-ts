import {initializeAppWorkerSaga} from './app-sagas';
import {call, put} from 'redux-saga/effects';
import {authAPI, MeResponseType} from '../api/todolists-api';
import {setLoggedInAC} from '../features/Login/auth-reducer';
import {setAppInitializedAC} from './app-reducer';

let meResponse: MeResponseType

beforeEach(() => {
    meResponse = {
        headers: {},
        status: 200,
        statusText: 'OK',
        config: {},
        request: {},
        data: {
            data: {login: '', id: 1, email: ''},
            resultCode: 0,
            fieldsErrors: [],
            messages: []
        }
    }
})

test('initializeAppWorkerSaga login success', () => {
    const gen = initializeAppWorkerSaga()
    expect(gen.next().value).toEqual(call(authAPI.me))

    expect(gen.next(meResponse).value).toEqual(put(setLoggedInAC(true)))

    expect(gen.next().value).toEqual(put(setAppInitializedAC(true)))
})

test('initializeAppWorkerSaga login failed', () => {
    const gen = initializeAppWorkerSaga()
    expect(gen.next().value).toEqual(call(authAPI.me))

    meResponse.data.resultCode = 1
    expect(gen.next(meResponse).value).toEqual(put(setAppInitializedAC(true)))
})