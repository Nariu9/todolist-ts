import {createAction} from '@reduxjs/toolkit';
import {ColorThemeType, RequestStatusType} from '../Application/application-reducer';

const changeAppTheme = createAction<{ colorTheme: ColorThemeType }>('app/changeAppTheme')
const setAppStatus = createAction<{ status: RequestStatusType }>('app/setAppStatus')
const setAppError = createAction<{ error: null | string }>('app/setAppError')

export const appActions = {
    changeAppTheme,
    setAppStatus,
    setAppError
}
