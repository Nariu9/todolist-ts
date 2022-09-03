import {AppInitialStateType, appReducer, changeAppThemeAC, setAppErrorAC, setAppStatusAC} from './app-reducer';

let startState: AppInitialStateType

beforeEach(() => {
    startState = {
        colorTheme: 'light',
        status: 'idle',
        error: null
    }
})

test('color theme should be changed', () => {

    const action = changeAppThemeAC('light')

    const endState = appReducer(startState, action)

    expect(endState.colorTheme).toBe('dark');
});

test('correct status should be set', () => {
    const endState = setAppStatusAC('succeeded')

    expect(endState.status).toBe('succeeded');
});

test('correct error should be set', () => {
    const endState = setAppErrorAC('some error')

    expect(endState.error).toBe('some error');
});