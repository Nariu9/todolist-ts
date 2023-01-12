import {call, put, takeEvery} from 'redux-saga/effects';
import {setAppStatusAC} from '../../app/app-reducer';
import {AxiosResponse} from 'axios';
import {GetTasksType, ResponseType, ResultCodes, todolistsAPI} from '../../api/todolists-api';
import {changeTaskEntityStatusAC, removeTaskAC, setTasksAC} from './tasks-reducer';

//action creators for sagas
export const fetchTasks = (todolistId: string) => ({type: 'TASKS/FETCH-TASKS', todolistId})
export const removeTask = (todolistId: string, taskId: string) => ({
    type: 'TASKS/TASK-REMOVE', todolistId, taskId
})

//sagas
export function* tasksSagas(action: ReturnType<typeof removeTask>) {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<GetTasksType> = yield call(todolistsAPI.getTasks, action.todolistId)
    yield put(setTasksAC(action.todolistId, res.data.items))
    yield put(setAppStatusAC('succeeded'))
}

export function* removeTaskWorkerSaga(action: ReturnType<typeof removeTask>) {
    yield put(setAppStatusAC('loading'))
    yield put(changeTaskEntityStatusAC(action.todolistId, action.taskId, 'loading'))
    const res: AxiosResponse<ResponseType> = yield call(todolistsAPI.deleteTask, {
        todolistId: action.todolistId,
        taskId: action.taskId
    })
    if (res.data.resultCode === ResultCodes.successfully) {
        yield put(removeTaskAC(action.todolistId, action.taskId))
        yield put(setAppStatusAC('succeeded'))
    } else {

    }
}

export function* tasksWatcherSaga () {
    yield takeEvery("TASKS/FETCH-TASKS", tasksSagas);
    yield takeEvery("TASKS/TASK-REMOVE", removeTaskWorkerSaga);
}