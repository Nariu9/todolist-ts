const initialState = {
    colorTheme: 'dark' as ColorThemeType,
    status: 'idle' as RequestStatusType,
    error: null as null | string
}

export const appReducer = (state: AppInitialStateType = initialState, action: AppActionsType): AppInitialStateType => {
    switch (action.type) {
        case 'APP/CHANGE-COLOR-THEME':
            return {...state, colorTheme: action.colorTheme === 'light' ? 'dark' : 'light'}
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default :
            return state
    }
}

// actions
export const changeAppThemeAC = (colorTheme: ColorThemeType) => ({type: 'APP/CHANGE-COLOR-THEME', colorTheme}) as const
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status}) as const
export const setAppErrorAC = (error: null | string) => ({type: 'APP/SET-ERROR', error}) as const


// types
export type ColorThemeType = 'dark' | 'light'
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialStateType = typeof initialState
export type AppActionsType = ReturnType<typeof changeAppThemeAC>
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>