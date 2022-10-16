import {ColorThemeType, RequestStatusType} from './application-reducer';
import {RootStateType} from './AppTypes';

export const selectIsInitialized = (state: RootStateType): boolean => state.app.isInitialized
export const selectStatus = (state: RootStateType): RequestStatusType => state.app.status
export const selectColorTheme = (state: RootStateType): ColorThemeType => state.app.colorTheme
export const selectError = (state: RootStateType): null | string => state.app.error