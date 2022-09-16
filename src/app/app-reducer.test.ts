import {
    AppInitialStateType,
    appReducer,
    changeAppThemeAC,
    setAppErrorAC,
    setAppInitializedAC,
    setAppStatusAC
} from './app-reducer';

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

    const action = changeAppThemeAC({colorTheme: 'light'})

    const endState = appReducer(startState, action)

    expect(endState.colorTheme).toBe('dark');
});

test('correct status should be set', () => {
    const endState = appReducer(startState, setAppStatusAC({status: 'succeeded'}))

    expect(endState.status).toBe('succeeded');
});

test('correct error should be set', () => {
    const endState = appReducer(startState, setAppErrorAC({error: 'some error'}))

    expect(endState.error).toBe('some error');
});

test('isInitialized property should be changed', () => {
    const endState = appReducer(startState, setAppInitializedAC({isInitialized: true}))

    expect(endState.isInitialized).toBe(true);
});