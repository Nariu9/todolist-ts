import {AnyAction, applyMiddleware, combineReducers, compose, legacy_createStore as createStore} from 'redux';
import {TasksActionsType, tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {TodolistsActionsType, todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {AppActionsType, appReducer} from './app-reducer';
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {authReducer} from '../features/Login/auth-reducer';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

export type AppRootStateType = ReturnType<typeof rootReducer>
// export type RootState = ReturnType<typeof store.getState>


type StoreActionsType = TodolistsActionsType | TasksActionsType | AppActionsType


export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, StoreActionsType>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

// @ts-ignore
window.store = store