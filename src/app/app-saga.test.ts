import {initializeAppWorkerSaga} from './app-sagas';
import {call, put} from 'redux-saga/effects';
import {authAPI, MeResponseType} from '../api/todolists-api';
import {setLoggedInAC} from '../features/Login/auth-reducer';
import {setAppInitializedAC} from './app-reducer';

test('initializeAppWorkerSaga test', () => {
    const gen = initializeAppWorkerSaga()
    let result = gen.next()
    expect(result.value).toEqual(call(authAPI.me))

    const fakeMeResponse: MeResponseType = {
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
    result = gen.next(fakeMeResponse)
    expect(result.value).toEqual(put(setLoggedInAC(true)))

    result = gen.next()
    expect(result.value).toEqual(put(setAppInitializedAC(true)))
})