import {RootStateType} from '../Application/AppTypes';

export const selectIsLoggedIn = (state: RootStateType): boolean => state.auth.isLoggedIn