import {
    addTaskAC, changeTaskEntityStatusAC,
    removeTaskAC,
    setTasksAC,
    tasksReducer, TasksStateType, updateTaskAC
} from './tasks-reducer';
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from './todolists-reducer';
import {TaskPriorities, TaskStatuses} from '../../api/todolists-api';

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
    const action = removeTaskAC({todolistId: 'todolistId2', taskId: '2'});

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

    const action = addTaskAC({task});

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
    const action = updateTaskAC({todolistId: 'todolistId1', taskId: '2', task});

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
    const action = updateTaskAC({todolistId: 'todolistId2', taskId: '3', task});

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][2].title).toBe('React');
    expect(endState['todolistId2'][2].title).toBe('coffee');
});

test('new array should be added when new todolist is added', () => {

    const todolist = {id: '1', title: 'new todolist', filter: 'all', addedDate: '', order: 0}

    const action = addTodolistAC({todolist});

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
    const action = removeTodolistAC({todolistId: 'todolistId2'});

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState['todolistId2']).not.toBeDefined();
});

test('empty arrays should be added when we set todolists', () => {
    const action = setTodolistsAC({
        todolists: [
            {id: '1', title: 'What to learn', addedDate: '', order: 0},
            {id: '2', title: 'What to buy', addedDate: '', order: 0}
        ]
    })

    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toStrictEqual([])
    expect(endState['2']).toStrictEqual([])
})

test('tasks should be added', () => {
    const action = setTasksAC({todolistId: 'todolistId1', tasks: startState['todolistId1']})

    const endState = tasksReducer({
        'todolistId1': [],
        'todolistId2': []
    }, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(0)
})

test('entity status of specified task should be changed', () => {

    const action = changeTaskEntityStatusAC({todolistId: 'todolistId2', taskId: '3', status: 'succeeded'});

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][2].entityStatus).toBe('idle');
    expect(endState['todolistId2'][2].entityStatus).toBe('succeeded');
});