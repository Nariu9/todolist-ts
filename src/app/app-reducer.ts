export type ColorThemeType = 'dark' | 'light'
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    colorTheme: 'dark' as ColorThemeType,
    status: 'idle' as RequestStatusType,
    error: null as null | string
}
type initialStateType = typeof initialState

export const appReducer = (state: initialStateType = initialState, action: AppActionsType | ThemeActionType): initialStateType => {
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

export const changeAppThemeAC = (colorTheme: ColorThemeType) => ({type: 'APP/CHANGE-COLOR-THEME', colorTheme}) as const
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status}) as const
export const setAppErrorAC = (error: null | string) => ({type: 'APP/SET-ERROR', error}) as const

export type ThemeActionType = ReturnType<typeof changeAppThemeAC>
export type AppActionsType = ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>
