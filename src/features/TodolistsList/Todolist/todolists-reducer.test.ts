import {FilterType, TodolistDomainType,} from './todolists-reducer';
import {v1} from 'uuid';
import {RequestStatusType} from '../../Application/application-reducer';
import {todolistsActions, todolistsReducer} from './index';


let todolistId1: string
let todolistId2: string
let startState: TodolistDomainType[] = []

const {
    addTodolist,
    changeFilter,
    changeTodolistEntityStatus,
    changeTodolistTitle,
    fetchTodolists,
    removeTodolist
} = todolistsActions

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all', entityStatus: 'idle', addedDate: '', order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', entityStatus: 'idle', addedDate: '', order: 0}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, removeTodolist.fulfilled({todolistId: todolistId1}, 'requiredId', todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    let newTodolistTitle = 'New Todolist';

    const todolist = {id: '1', title: 'New Todolist', filter: 'all', addedDate: '', order: 0}

    const endState = todolistsReducer(startState, addTodolist.fulfilled({todolist}, 'requiredId', 'New Todolist'))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
});

test('correct todolist should change its name', () => {
    let newTodolistTitle = 'New Todolist';

    const param = {
        todolistId: todolistId2,
        title: newTodolistTitle
    };
    const endState = todolistsReducer(startState, changeTodolistTitle.fulfilled(param, 'requiredId', param));

    expect(endState[0].title).toBe('What to learn');
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
    let newFilter: FilterType = 'completed';

    const endState = todolistsReducer(startState, changeFilter({todolistId: todolistId2, filter: newFilter}));

    expect(endState[0].filter).toBe('all');
    expect(endState[1].filter).toBe(newFilter);
});

test('todolists should be set to the state', () => {
    const action = fetchTodolists.fulfilled({todolists: startState}, 'requiredId')

    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2)
})

test('correct entity status of todolist should be changed', () => {
    let newStatus: RequestStatusType = 'loading';

    const endState = todolistsReducer(startState, changeTodolistEntityStatus({
        todolistId: todolistId2,
        entityStatus: newStatus
    }));

    expect(endState[0].entityStatus).toBe('idle');
    expect(endState[1].entityStatus).toBe(newStatus);
});