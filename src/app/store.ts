import {AnyAction, applyMiddleware, combineReducers, compose, legacy_createStore as createStore} from 'redux';
import {TasksActionsType, tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {TodolistsActionsType, todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {colorThemesReducer, ThemeActionType} from './colorThemes-reducer';
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    colorThemes: colorThemesReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

export type AppRootStateType = ReturnType<typeof rootReducer>
export type RootState = ReturnType<typeof store.getState>


type AppActionsType = TodolistsActionsType | TasksActionsType | ThemeActionType


export type AppDispatch = ThunkDispatch<RootState, unknown, AppActionsType>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>

// @ts-ignore
window.store = store