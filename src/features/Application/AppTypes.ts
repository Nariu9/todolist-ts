import {FieldsErrorsType} from '../../api/todolists-api';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {rootReducer} from '../../app/rootReducer';

export type RootReducerType = typeof rootReducer
export type RootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = ThunkDispatch<RootStateType, unknown, AnyAction>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootStateType, unknown, AnyAction>
export type ThunkErrorType = {
    rejectValue: {
        errors: string[]
        fieldsErrors?: FieldsErrorsType[]
    }
}