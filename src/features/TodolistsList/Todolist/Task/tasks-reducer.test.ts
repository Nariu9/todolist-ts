import {
    addTask,
    changeTaskEntityStatus,
    fetchTasks,
    removeTask,
    TasksStateType,
    updateTasks
} from './tasks-reducer';
import {addTodolist, fetchTodolists, removeTodolist} from '../todolists-reducer';
import {TaskPriorities, TaskStatuses} from '../../../../api/todolists-api';
import {tasksReducer} from './index';

let startState: TasksStateType = {}
beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1', title: 'CSS', description: '',
                todoListId: 'todolistId1',
                status: TaskStatuses.New,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '2', title: 'JS', description: '',
                todoListId: 'todolistId1',
                status: TaskStatuses.Completed,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '3', title: 'React', description: '',
                todoListId: 'todolistId1',
                status: TaskStatuses.New,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle'
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread', description: '',
                todoListId: 'todolistId2',
                status: TaskStatuses.New,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '2', title: 'milk', description: '',
                todoListId: 'todolistId2',
                status: TaskStatuses.Completed,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '3', title: 'tea', description: '',
                todoListId: 'todolistId2',
                status: TaskStatuses.New,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle'
            }
        ]
    };
})

test('correct task should be deleted from correct array', () => {
    const param = {todolistId: 'todolistId2', taskId: '2'};
    const action = removeTask.fulfilled(param,'requestId', param);

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {
                id: '1', title: 'CSS', description: '',
                todoListId: 'todolistId1',
                status: TaskStatuses.New,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '2', title: 'JS', description: '',
                todoListId: 'todolistId1',
                status: TaskStatuses.Completed,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '3', title: 'React', description: '',
                todoListId: 'todolistId1',
                status: TaskStatuses.New,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle'
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread', description: '',
                todoListId: 'todolistId2',
                status: TaskStatuses.New,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: '3', title: 'tea', description: '',
                todoListId: 'todolistId2',
                status: TaskStatuses.New,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle'
            }
        ]
    });

});

test('correct task should be added to correct array', () => {

    const task = {
        id: '333', title: 'juce', description: '',
        todoListId: 'todolistId2',
        status: TaskStatuses.New,
        order: 0,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        addedDate: ''
    }

    const action = addTask.fulfilled(task, 'requestId', {...task, todolistId: 'todolistId2', taskTitle: 'juce'});

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(4);
    expect(endState['todolistId2'][0].id).toBeDefined();
    expect(endState['todolistId2'][0].title).toBe('juce');
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New);
})

test('status of specified task should be changed', () => {

    const task = {
        id: '2', title: 'JS', description: '',
        todoListId: 'todolistId1',
        status: TaskStatuses.New,
        order: 0,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        addedDate: '',
        entityStatus: 'idle'
    }
    const action = updateTasks.fulfilled({todolistId: 'todolistId1', taskId: '2', task}, 'requestId',  {todolistId: 'todolistId1', taskId: '2', model: task});

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.New);
    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.Completed);
});

test('title of specified task should be changed', () => {

    const task = {
        id: '3', title: 'coffee', description: '',
        todoListId: 'todolistId2',
        status: TaskStatuses.Completed,
        order: 0,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        addedDate: '',
        entityStatus: 'idle'
    }
    const action = updateTasks.fulfilled({todolistId: 'todolistId2', taskId: '3', task},'requestId',  {todolistId: 'todolistId2', taskId: '3', model: task});

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][2].title).toBe('React');
    expect(endState['todolistId2'][2].title).toBe('coffee');
});

test('new array should be added when new todolist is added', () => {

    const todolist = {id: '1', title: 'new todolist', filter: 'all', addedDate: '', order: 0}

    const action = addTodolist.fulfilled({todolist}, 'requiredId', 'new todolist');

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2');
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {
    const action = removeTodolist.fulfilled({todolistId: 'todolistId2'}, 'requiredId',  'todolistId2');

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState['todolistId2']).not.toBeDefined();
});

test('empty arrays should be added when we set todolists', () => {
    const action = fetchTodolists.fulfilled({
        todolists: [
            {id: '1', title: 'What to learn', addedDate: '', order: 0},
            {id: '2', title: 'What to buy', addedDate: '', order: 0}
        ]
    }, 'requestId')

    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toStrictEqual([])
    expect(endState['2']).toStrictEqual([])
})

test('tasks should be added', () => {
    const action = fetchTasks.fulfilled({todolistId: 'todolistId1', tasks: startState['todolistId1']}, 'requestId', 'todolistId1')

    const endState = tasksReducer({
        'todolistId1': [],
        'todolistId2': []
    }, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(0)
})

test('entity status of specified task should be changed', () => {

    const action = changeTaskEntityStatus({todolistId: 'todolistId2', taskId: '3', status: 'succeeded'});

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][2].entityStatus).toBe('idle');
    expect(endState['todolistId2'][2].entityStatus).toBe('succeeded');
});