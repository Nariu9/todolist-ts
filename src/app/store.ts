import {AnyAction, combineReducers} from 'redux';
import {tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {appReducer} from './app-reducer';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {authReducer} from '../features/Login/auth-reducer';
import {configureStore} from '@reduxjs/toolkit';

// declare global {
//     interface Window {
//         __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
//     }
// }

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
export const store = configureStore({
    reducer: rootReducer,
    /*middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
    devTools: true*/
})
export type RootState = ReturnType<typeof rootReducer>
// export type RootState = ReturnType<typeof store.getState>


// type StoreActionsType = TodolistsActionsType | TasksActionsType | AppActionsType


export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>

// @ts-ignore
window.store = store