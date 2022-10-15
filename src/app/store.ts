import {AnyAction, combineReducers} from 'redux';
import {tasksReducer} from '../features/TodolistsList/Todolist/Task';
import {todolistsReducer} from '../features/TodolistsList/Todolist';
import {appReducer} from './index';
import {authReducer} from '../features/Login';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {configureStore} from '@reduxjs/toolkit';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
})
export type RootReducerType = typeof rootReducer
export type RootStateType = ReturnType<typeof rootReducer>

export type AppDispatch = ThunkDispatch<RootStateType, unknown, AnyAction>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootStateType, unknown, AnyAction>

// @ts-ignore
window.store = store