import {all, call, put, takeEvery} from 'redux-saga/effects';
import {setAppStatusAC} from '../../app/app-reducer';
import {AxiosResponse} from 'axios';
import {ResponseType, ResultCodes, todolistsAPI, TodolistType} from '../../api/todolists-api';
import {
    addTodolistAC,
    changeTodolistEntityStatusAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    setTodolistsAC
} from './todolists-reducer';
import {fetchTasks} from './tasks-sagas';

// action creators for sagas
export const fetchTodoLists = () => ({type: 'TODOLISTS/TODOLISTS-FETCH'})
export const deleteTodoList = (todolistId: string) => ({type: 'TODOLISTS/TODOLIST-DELETE', todolistId})
export const createTodoList = (todolistTitle: string) => ({type: 'TODOLISTS/TODOLIST-CREATE', todolistTitle})
export const updateTodoList = (todolistId: string, title: string) => ({
    type: 'TODOLISTS/TODOLIST-UPDATE',
    todolistId,
    title
})

// sagas
export function* fetchTodoListsWorkerSaga() {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<TodolistType[]> = yield call(todolistsAPI.getTodolists)
    yield put(setTodolistsAC(res.data))
    yield put(setAppStatusAC('succeeded'))
    yield all(res.data.map(tl => put(fetchTasks(tl.id))))
}

export function* removeTodoListWorkerSaga(action: ReturnType<typeof deleteTodoList>) {
    yield put(setAppStatusAC('loading'))
    yield put(changeTodolistEntityStatusAC(action.todolistId, 'loading'))
    const res: AxiosResponse<ResponseType> = yield call(todolistsAPI.deleteTodolist, action.todolistId)
    if (res.data.resultCode === ResultCodes.successfully) {
        yield put(removeTodolistAC(action.todolistId))
        yield put(setAppStatusAC('succeeded'))
    } else {
        yield put(changeTodolistEntityStatusAC(action.todolistId, 'failed'))
    }
}

export function* addTodoListWorkerSaga(action: ReturnType<typeof createTodoList>) {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<ResponseType<{ item: TodolistType }>> = yield call(todolistsAPI.createTodolist, action.todolistTitle)
    if (res.data.resultCode === ResultCodes.successfully) {
        yield put(addTodolistAC(res.data.data.item))
        yield put(setAppStatusAC('succeeded'))
    } else {

    }
}

export function* changeTodoListTitleWorkerSaga(action: ReturnType<typeof updateTodoList>) {
    yield put(setAppStatusAC('loading'))
    yield put(changeTodolistEntityStatusAC(action.todolistId, 'loading'))
    const res: AxiosResponse<ResponseType> = yield call(todolistsAPI.updateTodolist, {
        todolistId: action.todolistId,
        title: action.title
    })
    if (res.data.resultCode === ResultCodes.successfully) {
        yield put(changeTodolistTitleAC(action.todolistId, action.title))
        yield put(setAppStatusAC('succeeded'))
        yield put(changeTodolistEntityStatusAC(action.todolistId, 'idle'))
    } else {
        yield put(changeTodolistEntityStatusAC(action.todolistId, 'failed'))
    }
}

export function* todoListsWatSaga() {
    yield takeEvery('TODOLISTS/TODOLISTS-FETCH', fetchTodoListsWorkerSaga)
    yield takeEvery('TODOLISTS/TODOLIST-DELETE', removeTodoListWorkerSaga)
    yield takeEvery('TODOLISTS/TODOLIST-CREATE', addTodoListWorkerSaga)
    yield takeEvery('TODOLISTS/TODOLIST-UPDATE', changeTodoListTitleWorkerSaga)
}