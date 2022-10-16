import {combineReducers} from 'redux';
import {tasksReducer} from '../features/TodolistsList/Todolist/Task';
import {todolistsReducer} from '../features/TodolistsList/Todolist';
import {authReducer} from '../features/Login';
import {appReducer} from '../features/Application';

export const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})