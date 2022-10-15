import {
    AppInitialStateType,
    changeAppTheme,
    initializeApp,
    setAppError,
    setAppStatus
} from './app-reducer';
import {appReducer} from './index';

let startState: AppInitialStateType

beforeEach(() => {
    startState = {
        colorTheme: 'light',
        status: 'idle',
        error: null,
        isInitialized: false
    }
})

test('color theme should be changed', () => {

    const action = changeAppTheme({colorTheme: 'light'})

    const endState = appReducer(startState, action)

    expect(endState.colorTheme).toBe('dark');
});

test('correct status should be set', () => {
    const endState = appReducer(startState, setAppStatus({status: 'succeeded'}))

    expect(endState.status).toBe('succeeded');
});

test('correct error should be set', () => {
    const endState = appReducer(startState, setAppError({error: 'some error'}))

    expect(endState.error).toBe('some error');
});

test('isInitialized property should be changed', () => {
    const endState = appReducer(startState, initializeApp.fulfilled(undefined , 'requestId', undefined))

    expect(endState.isInitialized).toBe(true);
});