import {AnyAction, applyMiddleware, combineReducers, compose, legacy_createStore as createStore} from 'redux';
import {TasksActionsType, tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {TodolistsActionsType, todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {AppActionsType, appReducer} from './app-reducer';
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {authReducer} from '../features/Login/auth-reducer';
import createSagaMiddleware from 'redux-saga'
import {all} from 'redux-saga/effects'
import {tasksWatcherSaga} from '../features/TodolistsList/tasks-sagas';
import {appWatcherSaga, initializeApp} from './app-sagas';
import {todoListsWatSaga} from '../features/TodolistsList/todolists-sagas';

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

const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, sagaMiddleware)))

export type AppRootStateType = ReturnType<typeof rootReducer>
// export type RootState = ReturnType<typeof store.getState>

type StoreActionsType = TodolistsActionsType | TasksActionsType | AppActionsType | ReturnType<typeof initializeApp>


export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, StoreActionsType>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

sagaMiddleware.run(rootWatcher)

function* rootWatcher() {
    yield all([appWatcherSaga(), tasksWatcherSaga(), todoListsWatSaga()])
}

// @ts-ignore
window.store = store