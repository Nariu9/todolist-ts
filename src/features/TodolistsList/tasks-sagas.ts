import {call, put, takeEvery} from 'redux-saga/effects';
import {setAppStatusAC} from '../../app/app-reducer';
import {AxiosError, AxiosResponse} from 'axios';
import {GetTasksType, ResponseType, ResultCodes, TaskType, todolistsAPI} from '../../api/todolists-api';
import {
    addTaskAC,
    changeTaskEntityStatusAC,
    removeTaskAC,
    setTasksAC,
    UpdateDomainTaskModelType
} from './tasks-reducer';
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from '../../utils/error-utils';

//action creators for sagas
export const fetchTasks = (todolistId: string) => ({type: 'TASKS/FETCH-TASKS', todolistId} as const)
export const removeTask = (todolistId: string, taskId: string) => ({
    type: 'TASKS/TASK-REMOVE', todolistId, taskId
} as const)
export const createTask = (todolistId: string, taskTitle: string) => ({
    type: 'TASKS/TASK-CREATE', todolistId, taskTitle
} as const)
export const updateTask = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) => ({
    type: 'TASKS/TASK-UPDATE', todolistId, taskId, model
} as const)

//sagas
export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
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

export function* addTaskWorkerSaga(action: ReturnType<typeof createTask>) {
    yield put(setAppStatusAC('loading'))
    try {
        const res: AxiosResponse<ResponseType<{ item: TaskType }>> = yield call(todolistsAPI.createTask, {
            todolistId: action.todolistId,
            taskTitle: action.taskTitle
        })
        if (res.data.resultCode === ResultCodes.successfully) {
            yield put(addTaskAC(action.todolistId, res.data.data.item))
            yield put(setAppStatusAC('succeeded'))
        } else {
            yield* handleServerAppErrorSaga(res.data)
        }
    } catch (e) {
        yield* handleServerNetworkErrorSaga(e as AxiosError<{ message?: string }>)
    }
}


export function* tasksWatcherSaga() {
    yield takeEvery('TASKS/FETCH-TASKS', fetchTasksWorkerSaga);
    yield takeEvery('TASKS/TASK-REMOVE', removeTaskWorkerSaga);
    yield takeEvery('TASKS/TASK-CREATE', addTaskWorkerSaga);
}