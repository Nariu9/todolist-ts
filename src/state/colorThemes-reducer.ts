export type ColorThemeType = 'dark' | 'light'
type ColorThemesStateType = {
    colorTheme: ColorThemeType
}
type ActionType = ReturnType<typeof changeThemeAC>

const initialState: ColorThemesStateType = {
    colorTheme: 'dark'
}

export const colorThemesReducer = (state: ColorThemesStateType = initialState, action: ActionType): ColorThemesStateType => {
    switch (action.type) {
        case 'CHANGE-COLOR-THEME':
            return {...state, colorTheme: action.payload.colorTheme === 'light' ? 'dark' : 'light'}
        default :
            return state
    }
}

export const changeThemeAC = (colorTheme: ColorThemeType) => ({type: 'CHANGE-COLOR-THEME', payload: {colorTheme}})
