import {RootStateType} from '../../app/store';

export const selectIsLoggedIn = (state: RootStateType): boolean => state.auth.isLoggedIn