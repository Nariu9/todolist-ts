import {call, put} from 'redux-saga/effects';
import {addTaskWorkerSaga, fetchTasksWorkerSaga} from './tasks-sagas';
import {setAppErrorAC, setAppStatusAC} from '../../app/app-reducer';
import {GetTasksType, TaskPriorities, TaskStatuses, todolistsAPI} from '../../api/todolists-api';
import {AxiosResponse} from 'axios';
import {setTasksAC} from './tasks-reducer';

test('fetchTasksWorkerSaga success flow', () => {
    const todolistId = 'todolistId';

    const gen = fetchTasksWorkerSaga({type: 'TASKS/FETCH-TASKS', todolistId: todolistId})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))

    expect(gen.next().value).toEqual(call(todolistsAPI.getTasks, todolistId))

    const fakeFetchResponse: AxiosResponse<GetTasksType> = {
        headers: {},
        status: 200,
        statusText: 'OK',
        config: {},
        request: {},
        data: {
            items: [{
                id: '1', title: 'CSS', description: '',
                todoListId: todolistId,
                status: TaskStatuses.New,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            }],
            error: '',
            totalCount: 1
        }
    }
    expect(gen.next(fakeFetchResponse).value).toEqual(put(setTasksAC(todolistId, fakeFetchResponse.data.items)))

    expect(gen.next().value).toEqual(put(setAppStatusAC('succeeded')))
})

test('addTaskWorkerSaga error flow', () => {
    const todolistId = 'todolistId';
    const taskTitle = 'new task';

    const gen = addTaskWorkerSaga({type: 'TASKS/TASK-CREATE', todolistId: todolistId, taskTitle: taskTitle})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))

    expect(gen.next().value).toEqual(call(todolistsAPI.createTask, {
        todolistId,
        taskTitle
    }))

    expect(gen.throw({message: 'some error'}).value).toEqual(put(setAppStatusAC('failed')))
    expect(gen.next().value).toEqual(put(setAppErrorAC('some error')))
})
